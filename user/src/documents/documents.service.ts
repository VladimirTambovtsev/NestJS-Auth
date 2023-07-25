import {BadRequestException, HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateDocumentDto} from './dto/create-document.dto';
import {UpdateDocumentDto} from './dto/update-document.dto';
import {Documents} from './entities/document.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {GetDocumentDto} from './dto/get-document.dto';

@Injectable()
export class DocumentsService {
    constructor(@InjectRepository(Documents) private readonly documentsRepository: Repository<Documents>) {}

    /**
     * Update document path by id
     * @returns {Promise} Promise object represents documents
     */
    async updatePath(id: number, newPath: string) {
        const updatedRow = await this.documentsRepository.update({id}, {documentPath: newPath});
        if (!updatedRow) {
            throw new HttpException('No row found witht this ID', 204);
        }
        return true;
    }

    /**
     * Create document row
     * @returns {Promise} Promise object represents documents
     */
    async create(createDocumentsDto: CreateDocumentDto): Promise<CreateDocumentDto> {
        try {
            const addeddocuments = await this.documentsRepository.save({
                ...createDocumentsDto,
            });
            return addeddocuments;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    /**
     * Return array of documents
     * @returns {Promise} Promise array of object represents documents
     */
    async findAll(): Promise<GetDocumentDto[]> {
        const documents = await this.documentsRepository.find();
        return documents;
    }

    /**
     * Return array of documents by type
     * @returns {Promise} Promise array of object represents documents
     */
    async findAllByType(type: string) {
        try {
            // const documents = await this.documentsRepository.find({where: {type}});
            // return documents;
        } catch (error) {
            throw new BadRequestException('Documents not found with this type.');
        }
    }

    findOne(id: number) {
        return `This action returns a #${id} document`;
    }

    update(id: number, updateDocumentDto: UpdateDocumentDto) {
        return `This action updates a #${id} document`;
    }

    remove(id: number) {
        return `This action removes a #${id} document`;
    }
}
