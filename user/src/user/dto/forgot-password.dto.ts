import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class ForgotPasswordDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        default: 'test@test.com',
        description: 'Email where confirmation link with token will be send',
    })
    email: string;
}
