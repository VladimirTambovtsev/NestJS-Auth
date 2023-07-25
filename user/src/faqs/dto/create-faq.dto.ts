import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class CreateFaqDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: 'Question 1',
        description: 'Title',
    })
    question: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: 'Answer 1',
        description: 'Long answer',
    })
    answer: string;
}
