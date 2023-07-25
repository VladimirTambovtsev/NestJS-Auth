import {ForbiddenException, Injectable} from '@nestjs/common';
import {Service} from './entities/service.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateSeviceDTO} from './dto/create-service.dto';
import {User} from 'src/user/entities/user.entity';

@Injectable()
export class ServicesService {
    constructor(@InjectRepository(Service) private readonly serviceRepository: Repository<Service>, @InjectRepository(User) private readonly userRepo: Repository<User>) {}

    async create(createFaqDto: CreateSeviceDTO) {
        // const res = await this.userRepo.findOneBy({id: userId});
        // if (!res) throw new ForbiddenException('You cannot create new service');
        return await this.serviceRepository.save(createFaqDto);
    }

    async findAll() {
        return await this.serviceRepository.find();
    }
}
