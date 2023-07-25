import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NSIsImVtYWlsIjoidGFtYm92Y2VkZHZhOTlAbWFpbC5ydSIsImlhdCI6MTY0OTg3NTMwOSwiZXhwIjoxNjUwNDgwMTA5fQ.1NaWdoPLNV5Da',
        description: 'Token received from email reset-password link',
    })
    token: string;

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
}
