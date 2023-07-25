import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class GetBookingDTO {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        default: 'Question 1',
        description: 'Title',
    })
    totalPrice: number;

    @IsNotEmpty()
    @ApiProperty({
        default: 'Answer 1',
        description: 'Long answer',
    })
    time: string;
}
