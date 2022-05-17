import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {User} from '../entities/user.entity';

@Injectable()
export class EmailConfirmedGuard implements CanActivate {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if (request.user?.email) {
            const user = await this.userRepository.findOneBy({email: request.user.email});
            if (user.isEmailConfirmed) return true;
        }

        throw new UnauthorizedException('Confirm your email first');
    }
}
