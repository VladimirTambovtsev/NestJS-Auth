import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UploadedFile, UseInterceptors, ParseFilePipeBuilder, HttpException} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import {diskStorage} from 'multer';
import {extname} from 'path';
import {Public} from 'src/user/decorators';

import {DocumentsService} from './documents.service';
import {CreateDocumentDto} from './dto/create-document.dto';
import {UpdateDocumentDto} from './dto/update-document.dto';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    /**
     * Upload document and update documentPath by id before creating a row
     * @param header - Authorization Bearer access token. Decoded userId from access token
     * @returns {file} Object represents uploaded file
     */
    @ApiOperation({summary: 'Upload document and update documentPath by id before creating a row'})
    @ApiBearerAuth()
    @ApiResponse({status: 201, description: 'Object represents document entity'})
    @ApiResponse({status: 401, description: 'Invalid JWT Token'})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @Public()
    @Post('upload/:id')
    @UseInterceptors(
        FileInterceptor('file', {
            // Save with extension for pdf browser preview in Flutter
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    console.log('file: ', file);
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
            limits: {
                fileSize: 1000000000000,
            },
        })
    )
    upload(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'pdf',
                })
                .build({
                    fileIsRequired: true,
                })
        )
        file: Express.Multer.File,
        @Param('id') id: string
    ) {
        if (this.documentsService.updatePath(+id, file.path)) return file;
    }

    /**
     * Create documents with title, description and timeToRead values
     * @param header - Authorization Bearer access token. Decoded userId from access token
     * @param {CreateDocumentDto} body - document entity
     * @returns {CreateDocumentDto} Object represents CreateDocumentDto
     */
    @ApiOperation({summary: 'Create document type with title'})
    @ApiBearerAuth()
    @ApiResponse({status: 201, description: 'Object represents document entity'})
    @ApiResponse({status: 401, description: 'Invalid JWT Token'})
    @Public()
    @Post()
    create(@Body() createDocumentDto: CreateDocumentDto) {
        return this.documentsService.create(createDocumentDto);
    }

    /**
     * Get list of documents without pagination
     * @returns {GetDocumentDto[]} Array of objecs represents documents DTO
     */
    @ApiOperation({summary: 'Get list of documents'})
    @ApiParam({
        name: 'type',
        required: false,
        description: 'Document type from enum',
        schema: {oneOf: [{type: 'string'}, {type: 'integer'}]},
    })
    @ApiResponse({status: 200, description: 'Returns array of documents.'})
    @ApiResponse({status: 204, description: 'Request is valid, data is empty.'})
    @ApiResponse({status: 500, description: 'Internal server error.'})
    @Public()
    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(@Query() query: {type: string}) {
        if (query.type) {
            return this.documentsService.findAllByType(query.type);
        } else {
            return this.documentsService.findAll();
        }
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.documentsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
        return this.documentsService.update(+id, updateDocumentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.documentsService.remove(+id);
    }
}
