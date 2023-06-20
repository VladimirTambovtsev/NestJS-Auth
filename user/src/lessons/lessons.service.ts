import {Injectable} from '@nestjs/common';
import {CreateLessonDto} from './dto/create-lesson.dto';
import {UpdateLessonDto} from './dto/update-lesson.dto';
import {Repository} from 'typeorm';

import {InjectRepository} from '@nestjs/typeorm';
import {Lesson} from './entities/lesson.entity';

@Injectable()
export class LessonsService {
    constructor(@InjectRepository(Lesson) private readonly lessonRepository: Repository<Lesson>) {}

    create(createLessonDto: CreateLessonDto) {
        return this.lessonRepository.save({name: createLessonDto.name, time: createLessonDto.time});
    }

    findAll() {
        return this.lessonRepository.find();
    }

    update(id: number, updateLessonDto: UpdateLessonDto) {
        return this.lessonRepository.update(id, {name: updateLessonDto.name, time: updateLessonDto.time});
    }

    remove(id: number) {
        return this.lessonRepository.delete(id);
    }
}
