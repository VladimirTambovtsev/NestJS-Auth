import {Module} from '@nestjs/common';
import {FaqsService} from './faqs.service';
import {FaqsController} from './faqs.controller';
import {FAQ} from './entities/faq.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'src/user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FAQ, User])],
    controllers: [FaqsController],
    providers: [FaqsService],
})
export class FaqsModule {}
