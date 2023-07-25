import {Body, Controller, Get, Post} from '@nestjs/common';
import {BookingsService} from './bookings.service';
import {Public} from 'src/user/decorators';
import {CreateBookingDTO} from './dto/create-booking.dto';

@Controller('')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}

    @Public()
    @Post('/bookings')
    create(@Body() createBookingDto: CreateBookingDTO) {
        return this.bookingsService.create(createBookingDto);
    }

    @Get('/bookings')
    @Public()
    findAll() {
        return this.bookingsService.findAll();
    }
}
