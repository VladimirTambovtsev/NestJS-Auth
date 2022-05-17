import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {Request} from 'express';

import {GetCurrentUser, Public} from './decorators';
import {ConfirmEmailDto, ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto} from './dto';
import {AccessTokenGuard, EmailConfirmedGuard, RefreshTokenGuard} from './guards';
import {Tokens} from './types';
import {UserService} from './user.service';

@ApiTags('Auth')
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * Registers new user with email, password and password_confirm. Send email confirmation
     * @param {RegisterDto} body - Email, password and password_confirm
     * @returns {Tokens} Object represents access token and refresh token
     */
    @ApiOperation({summary: 'Registers new user with email, password and password_confirm. Sends verify email link'})
    @ApiResponse({status: 201, description: 'Object represents access token and refresh token'})
    @ApiResponse({status: 409, description: 'Handled user already registered with this email'})
    @ApiResponse({status: 400, description: 'Password and confirm password do not password match / Invalid email / Password is less than 12 characters'})
    @Public()
    @Post('/local/register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() body: RegisterDto): Promise<Tokens> {
        return this.userService.register(body);
    }

    /**
     * Login existing user by email and password
     * @param {LoginDto} body - Email, password
     * @returns {Tokens} Object represents access token and refresh token
     */
    @ApiOperation({summary: 'Login existing user by email and password'})
    @ApiResponse({status: 200, description: 'Object represents access token and refresh token'})
    @ApiResponse({status: 400, description: 'Invalid email | Password is shorter than 12 characters'})
    @ApiResponse({status: 404, description: 'Not Found. Email or password is incorrect'})
    @Public()
    @Post('/local/login')
    @HttpCode(HttpStatus.OK)
    login(@Body() body: LoginDto): Promise<Tokens> {
        return this.userService.login(body);
    }

    /**
     * Logout user. Set 'hashed_refresh_token' database field to null.
     * @param header - Authorization Bearer access token. Decoded userId from access token
     * @returns Empty body with status '200'
     */
    @ApiOperation({summary: 'Logout user'})
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: 'Logout user successfully'})
    @ApiResponse({status: 401, description: 'Authorization Bearer access JWT is not correct or not provided.'})
    @UseGuards(AccessTokenGuard)
    @Post('/local/logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUser('sub') userId: number) {
        return this.userService.logout(userId);
    }

    /**
     * Refresh JWT access_token from JWT refresh_token. Update refresh and access JWT tokens.
     * @param header - Authorization Bearer refresh token. Decoded userId from refresh token
     * @returns JWT access token
     */
    @ApiOperation({summary: 'Refresh JWT access_token from JWT refresh_token. Update refresh and access JWT tokens.'})
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: 'Object represents access token and refresh token'})
    @ApiResponse({status: 401, description: 'Authorization Bearer refresh JWT is not correct or not provided.'})
    @ApiResponse({status: 403, description: 'Access denied.'})
    @Public()
    @UseGuards(RefreshTokenGuard)
    @Post('/local/refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@GetCurrentUser('sub') userId: number, @GetCurrentUser('refreshToken') refreshToken: string) {
        return this.userService.refreshTokens(userId, refreshToken);
    }

    /**
     * Verify email from received mail confirmation link
     * @param {ConfirmEmailDto} confirmEmailDto - Object represents unique token from confirmation link
     * @returns Empty body with status '200'
     */
    @ApiOperation({summary: 'Verify email from received mail confirmation. Update `isEmailConfirmed` to true in database'})
    @ApiResponse({status: 200, description: 'Success. Empty body'})
    @ApiResponse({status: 403, description: 'Bad confirmation token'})
    @ApiResponse({status: 409, description: 'Email already confirmed'})
    @ApiResponse({status: 410, description: 'Email confirmation token expired'})
    @Public()
    @Post('/local/email-confirm')
    @HttpCode(HttpStatus.OK)
    async confirm(@Body() confirmEmailDto: ConfirmEmailDto) {
        await this.userService.confirmEmail(confirmEmailDto.token);
    }

    /**
     * Resend confirmation link to email if user did not verified his email yet.
     * @param header - Authorization Bearer access token. Decoded userId from access token
     * @returns Empty body with status '200'
     */
    @ApiOperation({summary: 'Resend confirmation link to email if user did not verified his email yet.'})
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: 'Success. Empty body'})
    @ApiResponse({status: 400, description: 'User with such id does not exist'})
    @ApiResponse({status: 401, description: 'Unauthorized or invalid access JWT'})
    @ApiResponse({status: 409, description: 'Email already confirmed'})
    @UseGuards(AccessTokenGuard)
    @Post('/local/resend-confirmation-link')
    @HttpCode(HttpStatus.OK)
    async resendConfirmationLink(@GetCurrentUser('sub') userId: number) {
        await this.userService.resendConfirmationLink(userId);
    }

    /**
     * Forgot password, send link reset password link to email
     * @param {ForgotPasswordDto} forgotPasswordDto - Email
     * @returns Empty body with status '200'f
     */
    @ApiOperation({summary: 'Forgot password, send link reset password link to email.'})
    @ApiResponse({status: 200, description: 'Success. Empty body'})
    @ApiResponse({status: 400, description: 'User with such email does not exist'})
    @Public()
    @Post('/local/password-forgot')
    @HttpCode(HttpStatus.OK)
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.userService.sendChangePasswordLink(forgotPasswordDto.email);
    }

    /**
     * Reset password from reset password link received on email
     * @param {ResetPasswordDto} resetPasswordDto - token received from email, new password, password confirm
     * @returns {Tokens} Object represents access token and refresh token
     */
    @ApiOperation({summary: 'Reset password from reset password link received on email.'})
    @ApiResponse({status: 200, description: 'Object represents access token and refresh token.'})
    @ApiResponse({status: 400, description: 'Passwords do not match'})
    @ApiResponse({status: 404, description: 'User does not exist with this email'})
    @ApiResponse({status: 409, description: 'Email already confirmed'})
    @ApiResponse({status: 410, description: 'Email confirmation token expired'})
    @Public()
    @Post('/local/password-reset')
    @HttpCode(HttpStatus.OK)
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.userService.resetPassword(resetPasswordDto);
    }

    /**
     * Testing-Route only for checking if email is confirm
     * TODO: remove this route
     */
    @UseGuards(EmailConfirmedGuard)
    @UseGuards(AccessTokenGuard)
    @Post('/pay')
    @HttpCode(HttpStatus.OK)
    async paySomething(@GetCurrentUser('sub') userId: number) {
        return 'Private with confirmed email only ' + userId;
    }

    /**
     * Redirect to google OAuth page to log in
     * @returns
     */
    @Public()
    @Get('/oauth/google')
    @UseGuards(AuthGuard('google'))
    async googleOAuth() {
        return '';
    }

    /**
     * Redirect from google login page to this page
     * @param req
     * @returns
     */
    @Public()
    @Get('/oauth/auth/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleOAuthRedirect(@Req() req: Request) {
        return this.userService.googleOAuthLogin(req);
    }
}
