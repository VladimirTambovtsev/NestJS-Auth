import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsString} from 'class-validator';

export class GetDocumentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: 'Title 1',
        description: 'Title of news entity',
    })
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: 'Document path 1',
        description: 'Document path of news entity',
    })
    documentPath: string;

    // @ApiProperty({
    //     default: 'Нормативные документы',
    //     description: 'Document type of enum',
    // })
    // type: string;
}
