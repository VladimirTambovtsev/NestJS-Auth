import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class ConfirmEmailDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NSIsImVtYWlsIjoidGFtYm92Y2VkZHZhOTlAbWFpbC5ydSIsImlhdCI6MTY0OTg3NTMwOSwiZXhwIjoxNjUwNDgwMTA5fQ.1NaWdoPLNV5MAA',
        description: 'Token received from email confirmation link',
    })
    token: string;
}
