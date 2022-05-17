import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

interface VerifyAccountDto {
  from: string;
  to: string;
  subject: string;
  confirmLink: string;
}

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern('default')
  verifyAccount(@Payload() verifyAccountDto: KafkaMessage) {
    // const value = message.value
    console.log('verifyAccountDto.value: ', verifyAccountDto.value);
    return this.emailService.verifyAccount(verifyAccountDto.value as any);
  }
  //
  //
  //

  // @MessagePattern('default')
  // create(@Payload() createEmailDto: CreateEmailDto) {
  //   return this.emailService.create(createEmailDto);
  // }

  // @MessagePattern('findAllEmail')
  // findAll() {
  //   return this.emailService.findAll();
  // }

  // @MessagePattern('findOneEmail')
  // findOne(@Payload() id: number) {
  //   return this.emailService.findOne(id);
  // }

  // @MessagePattern('updateEmail')
  // update(@Payload() updateEmailDto: UpdateEmailDto) {
  //   return this.emailService.update(updateEmailDto.id, updateEmailDto);
  // }

  // @MessagePattern('removeEmail')
  // remove(@Payload() id: number) {
  //   return this.emailService.remove(id);
  // }
}
