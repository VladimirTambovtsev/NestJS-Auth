import {PartialType} from '@nestjs/swagger';
import {CreateBookingDTO} from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDTO) {}
