import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class DeleteDocumentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: '1',
        description: 'ID of document entity',
    })
    id: string;
}
