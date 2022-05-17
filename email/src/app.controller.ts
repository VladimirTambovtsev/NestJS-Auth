import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from '@nestjs/microservices/external/kafka.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // @MessagePattern('default')
  // getHello(@Payload() message: KafkaMessage): string {
  //   console.log('message: ', message);
  //   return this.appService.getHello();
  // }
}
