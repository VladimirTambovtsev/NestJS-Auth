import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class GetSeviceDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: 'Question 1',
        description: 'Title',
    })
    title: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        default: 'Answer 1',
        description: 'Long answer',
    })
    price: number;
}
