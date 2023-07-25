import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import {FaqsService} from './faqs.service';
import {UpdateFaqDto} from './dto/update-faq.dto';
import {GetCurrentUser, Public} from 'src/user/decorators';
import {AccessTokenGuard} from 'src/user/guards';
import {CreateFaqDTO} from './dto/create-faq.dto';

@Controller()
export class FaqsController {
    constructor(private readonly faqsService: FaqsService) {}

    // // @UseGuards(AccessTokenGuard)
    @Post('/faqs')
    @Public()
    create(@Body() createFaqDto: CreateFaqDTO) {
        return this.faqsService.create(createFaqDto);
    }

    @Get('/faqs')
    @Public()
    findAll() {
        return this.faqsService.findAll();
    }
}
