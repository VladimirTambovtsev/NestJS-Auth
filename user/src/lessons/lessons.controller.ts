import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {LessonsService} from './lessons.service';
import {CreateLessonDto} from './dto/create-lesson.dto';
import {UpdateLessonDto} from './dto/update-lesson.dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {Public} from 'src/user/decorators';

@ApiTags('Lesson')
@Controller('lesson')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @ApiBearerAuth()
    @Public()
    @Post()
    create(@Body() createLessonDto: CreateLessonDto) {
        return this.lessonsService.create(createLessonDto);
    }

    @ApiBearerAuth()
    @Public()
    @Get()
    findAll() {
        return this.lessonsService.findAll();
    }

    @ApiBearerAuth()
    @Public()
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
        return this.lessonsService.update(+id, updateLessonDto);
    }

    @ApiBearerAuth()
    @Public()
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.lessonsService.remove(+id);
    }
}
