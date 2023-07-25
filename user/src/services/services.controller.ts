import {Body, Controller, Get, Post} from '@nestjs/common';
import {ServicesService} from './services.service';
import {GetCurrentUser, Public} from 'src/user/decorators';
import {CreateSeviceDTO} from './dto/create-service.dto';

@Controller()
export class ServicesController {
    constructor(private readonly sService: ServicesService) {}

    @Public()
    @Post('/service')
    create(@Body() createFaqDto: CreateSeviceDTO) {
        return this.sService.create(createFaqDto);
    }

    @Get('/services')
    @Public()
    findAll() {
        return this.sService.findAll();
    }
}
