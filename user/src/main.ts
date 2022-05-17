import {ValidationPipe} from '@nestjs/common';
import {NestFactory, Reflector} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

import {AppModule} from './app.module';
import {AccessTokenGuard} from './user/guards';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'verbose', 'debug'],
    });

    const reflector = new Reflector();
    app.useGlobalGuards(new AccessTokenGuard(reflector));
    app.useGlobalPipes(new ValidationPipe());

    if (process.env.NODE_ENV !== 'production') {
        const swaggerConfig = new DocumentBuilder()
            .addBearerAuth()
            .setTitle('User Auth service')
            .setDescription('REST API Documentation')
            .setVersion('1.0.0')
            .addTag('Microservice')
            .build();
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('/api/docs', app, document);
    }

    await app.listen(3000);
}
bootstrap();
