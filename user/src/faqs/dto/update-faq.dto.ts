import {PartialType} from '@nestjs/swagger';
import {CreateFaqDTO} from './create-faq.dto';

export class UpdateFaqDto extends PartialType(CreateFaqDTO) {}
