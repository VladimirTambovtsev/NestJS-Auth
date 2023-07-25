import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsEmail({unique: true})
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
    @IsNotEmpty()
    @ApiProperty({
        default: '@6h-LFd@^p}_7;h<n',
        description: 'User password. Must include number, special character, uppercase letter and be at least 12 characters',
    })
    password: string;

    @IsString()
    @MinLength(8)
    @MaxLength(70)
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message: 'Password must include number, special character, uppercase letter',
    // })
    @IsNotEmpty()
    @ApiProperty({
        default: '@6h-LFd@^p}_7;h<n',
        description: 'User confirming password. Must be the same as password',
    })
    password_confirm: string;

    @IsString()
    @MinLength(5)
    @MaxLength(14)
    @IsNotEmpty()
    @ApiProperty({
        default: '+79881407744',
        description: 'User phone',
    })
    phone: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @IsNotEmpty()
    @ApiProperty({
        default: 'Ivanov Ivan Ivanovich',
        description: 'User full name',
    })
    fullname: string;
}
