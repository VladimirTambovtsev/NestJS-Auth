import {Module} from '@nestjs/common';
import {ServicesService} from './services.service';
import {ServicesController} from './services.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Service} from './entities/service.entity';
import {User} from 'src/user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Service, User])],
    controllers: [ServicesController],
    providers: [ServicesService],
})
export class ServicesModule {}
