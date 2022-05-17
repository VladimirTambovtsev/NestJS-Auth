import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const MAILGUN_API_KEY = '1db21430c8573c91d87c90071828bd46-7238b007-17e972ee';
const MAILGUN_API_DOMAIN =
  'https://api.mailgun.net/v3/sandboxc6ca8ab4fc434bb187f4d4d7923c8705.mailgun.org';
const MAILGUN_FROM = 'Authentication';

@Injectable()
export class EmailService {
  private mg;

  constructor() {
    const mg = mailgun.client({
      username: 'api',
      key: MAILGUN_API_KEY,
      // key: this.configService.get<string>('MAILGUN_API_KEY'),
    });
    this.mg = mg;
  }

  verifyAccount(verifyAccountDto: CreateEmailDto) {
    const recipientVars = {
      [verifyAccountDto.to]: {
        preHeader: 'Reset Password',
        buttonText: 'Press here',
        url: verifyAccountDto.confirmLink,
      },
    };
    const html = fs.readFileSync(
      path.join(__dirname, './templates/email-confirmation.html'),
      'utf8',
    );
    this.mg.messages
      .create('sandboxc6ca8ab4fc434bb187f4d4d7923c8705.mailgun.org', {
        from: `${verifyAccountDto.from} <mailgun@sandboxc6ca8ab4fc434bb187f4d4d7923c8705.mailgun.org>`,
        to: [verifyAccountDto.to],
        subject: verifyAccountDto.subject,
        html,
        'recipient-variables': JSON.stringify(recipientVars),
      })
      .then((msg) => console.log(msg))
      .catch((err) => console.log(err));
  }

  create(createEmailDto: CreateEmailDto) {
    return 'This action adds a new email';
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
