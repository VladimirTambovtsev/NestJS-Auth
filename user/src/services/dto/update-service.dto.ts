import {PartialType} from '@nestjs/swagger';
import {CreateSeviceDTO} from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateSeviceDTO) {}
