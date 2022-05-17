import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['pkc-4ygn6.europe-west3.gcp.confluent.cloud:9092'],
          ssl: true,
          sasl: {
            mechanism: 'plain',
            username: 'PP6WEWYOYYZ35H3V',
            password:
              'g92IuFKUrDMCjl0Y/KcjYE4ndZB5GDgj+sZI0FAWAq5y7/5Vh54yek9IRwYVzR+/',
          },
        },
      },
    },
  );
  const PORT = process.env.PORT || 3000;
  app.listen();
}
bootstrap();

// KEY: PP6WEWYOYYZ35H3V
// SECRET: g92IuFKUrDMCjl0Y/KcjYE4ndZB5GDgj+sZI0FAWAq5y7/5Vh54yek9IRwYVzR+/
// # Required connection configs for Kafka producer, consumer, and admin
// bootstrap.servers=pkc-4ygn6.europe-west3.gcp.confluent.cloud:9092
// security.protocol=SASL_SSL
// sasl.mechanisms=PLAIN
// sasl.username={{ CLUSTER_API_KEY }}
// sasl.password={{ CLUSTER_API_SECRET }}

// # Best practice for higher availability in librdkafka clients prior to 1.7
// session.timeout.ms=45000
