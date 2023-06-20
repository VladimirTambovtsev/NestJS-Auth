import {ApiProperty} from '@nestjs/swagger';
import {IsDate, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from 'class-validator';

export class CreateLessonDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: 'Lesson 1',
        description: 'Lesson name',
    })
    name: string;

    @IsNotEmpty()
    @ApiProperty({
        default: '2023-06-20T11:43:32.005Z',
        description: 'Lesson date time',
    })
    time: string;

    @IsString()
    @ApiProperty({
        default: '1',
        description: 'User ids',
    })
    user: string;
}
