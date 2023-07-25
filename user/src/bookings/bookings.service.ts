import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Booking} from './entities/booking.entity';
import {Repository} from 'typeorm';
// import nodemailer from 'nodemailer';

import {CreateBookingDTO} from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    // private transporter: nodemailer.Transporter;

    constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>) {
        // this.transporter = nodemailer.createTransport({
        //     // Replace these options with your own email service provider configuration
        //     // For example, for Gmail, you may use SMTP settings
        //     host: 'smtp.yandex.com',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: 'tambovcev99@ya.com',
        //         pass: 'Tambovtsev_44',
        //     },
        // });
    }

    async create(createBookingDto: CreateBookingDTO) {
        // const res = await this.userRepo.findOneBy({id: userId});
        // if (!res) throw new ForbiddenException('You cannot create new service');

        const dateObject = new Date(createBookingDto.time);

        const year = dateObject.getUTCFullYear();
        const month = dateObject.getUTCMonth() + 1; // Month is zero-based, so add 1
        const day = dateObject.getUTCDate();
        const hours = dateObject.getUTCHours();
        const minutes = dateObject.getUTCMinutes();

        // this.sendRawEmail('tambovcev99@ya.ru', `Новая запись на сумму ${createBookingDto.totalPrice} <br/> ${year}г. ${month} ${day} в ${hours} часов ${minutes} минут`);
        return await this.bookingRepository.save(createBookingDto);
    }

    async findAll() {
        return await this.bookingRepository.find();
    }

    private async sendRawEmail(to: string, message: string) {
        try {
            // // Sending the raw email
            // const info = await this.transporter.sendMail({
            //     from: 'tambovcev99@ya.com', // Sender email address
            //     to: to, // Recipient email address
            //     subject: 'Новая запись', // Email subject
            //     text: message, // The raw email message content
            // });
            // console.log('Raw email sent: ', info);
            // return info;
        } catch (error) {
            console.error('Error sending raw email: ', error);
            throw error;
        }
    }
}
