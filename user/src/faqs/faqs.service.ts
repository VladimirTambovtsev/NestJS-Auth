import {ForbiddenException, Injectable} from '@nestjs/common';
import {UpdateFaqDto} from './dto/update-faq.dto';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {FAQ} from './entities/faq.entity';
import {CreateFaqDTO} from './dto/create-faq.dto';
import {User} from 'src/user/entities/user.entity';

@Injectable()
export class FaqsService {
    constructor(@InjectRepository(FAQ) private readonly faqRepository: Repository<FAQ>, @InjectRepository(User) private readonly userRepo: Repository<User>) {}

    async create(createFaqDto: CreateFaqDTO) {
        // const res = await this.userRepo.findOneBy({id: userId});
        // if (!res) throw new ForbiddenException('You cannot create new document');
        return await this.faqRepository.save(createFaqDto);
    }

    async findAll() {
        return await this.faqRepository.find();
    }
}
