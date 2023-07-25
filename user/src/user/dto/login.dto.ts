import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';

export class LoginDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        default: 'test@test.com',
        description: 'User email',
    })
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(70)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message: 'Password must include number, special character, uppercase letter',
    // })
    @ApiProperty({
        default: '@6h-LFd@^p}_7;h<n',
        description: 'User password. Must include number, special character, uppercase letter and be at least 8 characters',
    })
    password: string;
}
