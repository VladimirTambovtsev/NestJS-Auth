import {BadRequestException, ConflictException, ForbiddenException, GoneException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ClientKafka} from '@nestjs/microservices';
import {InjectRepository} from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {Repository} from 'typeorm';

import {LoginDto, RegisterDto, ResetPasswordDto} from './dto';
import {User} from './entities/user.entity';
import {JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET} from './strategies';
import {Tokens, VerifyEmail} from './types';

@Injectable()
export class UserService {
    constructor(
        @Inject('KAFKA_SERVICE') private clientKafka: ClientKafka,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async me(id) {
        const res = await this.userRepository.findOneBy({id});
        if (!res) throw new NotFoundException('User not found with this JWT');
        delete res['password'];
        return res;
    }

    /**
     * Send confirmation on email to verify account
     * @param {VerifyEmail} sendEmailOptions - From, to, email subject, confirmation link
     */
    private async sendEmail(sendEmailOptions: VerifyEmail): Promise<void> {
        await this.clientKafka.emit('default', sendEmailOptions);
    }

    /**
     * Generate and return access and refresh new tokens
     * @param {string} userId - User id
     * @param {string} email - User email
     * @returns {Promise} Promise object represents access token and refresh token
     */
    private async getTokens(userId: string, email: string): Promise<Tokens> {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(
                {sub: userId, email},
                {secret: JWT_ACCESS_TOKEN_SECRET, expiresIn: 60 * 15} // 15 minutes
            ),
            this.jwtService.signAsync(
                {sub: userId, email},
                {secret: JWT_REFRESH_TOKEN_SECRET, expiresIn: 60 * 60 * 24 * 7} // 7 days
            ),
        ]);
        return {
            access_token,
            refresh_token,
        };
    }

    /**
     * Hashed refresh token and update in database by user id
     * @param {number} userId - User id
     * @param {string} refreshToken - Refresh token to hash
     */
    private async updateRefreshTokenHash(userId: number, refreshToken: string): Promise<void> {
        const hashed = await bcrypt.hash(refreshToken, 12);
        await this.userRepository.update(userId, {
            hashed_refresh_token: hashed,
        });
    }

    /**
     * Register new user account with access and refresh JWT strategies
     * @param {RegisterDto} registerDto - Email, password and password_confirm
     * @returns {Promise} Promise object represents access token and refresh token
     */
    async register(registerDto: RegisterDto): Promise<Tokens> {
        const {password, password_confirm} = registerDto;
        if (password !== password_confirm) {
            throw new BadRequestException('Пароли не совпадают');
        }
        const alreadyExists = await this.userRepository.findOneBy({
            email: registerDto.email,
        });
        if (alreadyExists) {
            throw new ConflictException('Этот Email ранее зарегистрирован');
        }

        const hashed = await bcrypt.hash(password, 12);
        const newUser = await this.userRepository.save({
            ...registerDto,
            password: hashed,
        });
        if (newUser) {
            const tokens = await this.getTokens(newUser.id.toString(), newUser.email);
            await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
            // const confirmLink = `http://localhost:2000/?token=${tokens.refresh_token}`;
            // this.sendEmail({
            //     from: 'Authentication',
            //     to: registerDto.email,
            //     subject: 'Confirm account',
            //     confirmLink,
            // });
            return tokens;
        }
    }

    /**
     * Checks if user exists in database with such email, encrypt password and compare with database hash. Return tokens if success
     * @param {LoginDto} loginDto - Email and password
     * @returns {Promise} Promise object represents access token and refresh token
     */
    async login(loginDto: LoginDto): Promise<Tokens> {
        const user = await this.userRepository.findOneBy({email: loginDto.email});
        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new NotFoundException('Invalid credentials');
        }
        const tokens = await this.getTokens(user.id.toString(), user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }

    /**
     * Logout user: remove hashed_refresh_token from database by user id
     * @param {number} userId - User id
     * @returns {Promise} void
     */
    async logout(userId: number): Promise<void> {
        await this.userRepository.createQueryBuilder().update().set({hashed_refresh_token: null}).where({id: userId}).andWhere('hashed_refresh_token IS NOT NULL').execute();
    }

    /**
     * Generate and return new access and refresh new tokens if refresh token was provided and user was found by id from JWT
     * @param {number} userId - User id from JWT
     * @param {string} refreshToken - Refresh token which will be checked
     * @returns {Promise} Promise object represents access token and refresh token
     */
    async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
        const user = await this.userRepository.findOneBy({id: userId});
        if (!user || !user.hashed_refresh_token || !(await bcrypt.compare(refreshToken, user.hashed_refresh_token))) {
            throw new ForbiddenException('Access denied');
        }
        const tokens = await this.getTokens(user.id.toString(), user.email);
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;
    }

    /**
     * Confirm the email from the received link by mail
     * @param {string} confirmationToken - refresh JWT from link by mail
     * @returns {Promise} void
     */
    async confirmEmail(confirmationToken: string) {
        const email = await this.decodeEmailConfirmationToken(confirmationToken);
        const user = await this.userRepository.findOneBy({email});
        if (user.isEmailConfirmed) {
            throw new ConflictException('Email already confirmed');
        }
        if (email && user) return await this.userRepository.update({email}, {isEmailConfirmed: true});
    }

    /**
     * Decode token to verify email
     * @param token - Refresh JWT from link by email
     * @returns {string} Email decoded from JWT
     */
    private async decodeEmailConfirmationToken(token: string) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: JWT_REFRESH_TOKEN_SECRET,
            });

            if (typeof payload === 'object' && 'email' in payload) {
                return payload.email;
            }
            throw new BadRequestException();
        } catch (error) {
            if (error?.name === 'TokenExpiredError') {
                throw new GoneException('Email confirmation token expired');
            }
            throw new ForbiddenException('Bad confirmation token');
        }
    }

    /**
     * Resend confirmation link to email to verify user email if it hasn't been verified yet.
     * @param userId - User id decoded from access JWT
     * @returns {Promise} void
     */
    async resendConfirmationLink(userId: number) {
        const user = await this.userRepository.findOneBy({id: userId});
        if (user.isEmailConfirmed) {
            throw new ConflictException('Email already confirmed');
        }
        if (!user) {
            throw new BadRequestException('User with such id does not exist');
        }

        const tokens = await this.getTokens(userId.toString(), user.email);
        const confirmLink = `http://localhost:2000/?token=${tokens.refresh_token}`;
        this.sendEmail({
            from: 'Authentication',
            to: user.email,
            subject: 'Confirm account',
            confirmLink,
        });
    }

    /**
     * Send change-password-link to email when user forgot his password
     * @param email - User email where to send recovery link
     * @returns {Promise} void
     */
    async sendChangePasswordLink(email: string) {
        const user = await this.userRepository.findOneBy({email});
        if (!user) {
            throw new BadRequestException('User with such email does not exist');
        }
        if (user) {
            const tokens = await this.getTokens(user.id.toString(), user.email);
            const confirmLink = `http://localhost:2000/?recoverPasswordToken=${tokens.refresh_token}`;
            this.sendEmail({
                from: 'Recover password',
                to: user.email,
                subject: 'Recover password',
                confirmLink,
            });
        }
    }

    /**
     * Reset password by token from change-password-link received from email
     * @param {ResetPasswordDto} registerDto - Password, password_confirm, token from email reset-link
     * @returns {Promise} Promise object represents access token and refresh token
     */
    async resetPassword(registerDto: ResetPasswordDto): Promise<Tokens> {
        const {password, password_confirm, token} = registerDto;
        if (password !== password_confirm) {
            throw new BadRequestException('Passwords do not match');
        }
        const email = await this.decodeEmailConfirmationToken(token);
        const user = await this.userRepository.findOneBy({email});
        if (!user || !email) {
            throw new NotFoundException('User does not exist with this email');
        }

        const hashed = await bcrypt.hash(password, 12);
        const updatedUser = await this.userRepository.update({id: user.id}, {password: hashed});
        if (updatedUser) {
            const tokens = await this.getTokens(user.id.toString(), user.email);
            await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
            this.sendEmail({
                from: 'You have successfully changed your password',
                to: user.email,
                subject: 'You have successfully changed your password',
                confirmLink: '',
            });
            return tokens;
        }
    }

    async deleteOwnAccount(userId: number) {
        const user = await this.userRepository.findBy({id: userId});
        if (!user) throw new ForbiddenException();
        return await this.userRepository.delete({id: userId});
    }

    /**
     * Google OAuth 2.0
     */
    async googleOAuthLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }
        return {
            message: 'User info from google',
            user: req.user,
        };
    }
}
