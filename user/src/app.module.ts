import {join} from 'path';
import * as Joi from '@hapi/joi';
import {MiddlewareConsumer, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ServeStaticModule} from '@nestjs/serve-static';

import LogsMiddleware from './logs.middleware';
import {AccessTokenGuard} from './user/guards';
import {UserModule} from './user/user.module';
import {DocumentsModule} from './documents/documents.module';
import {FaqsModule} from './faqs/faqs.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
                JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
                EMAIL_CONFIRMATION_URL: Joi.string().required(),
            }),
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            database: 'gettingstarted',
            username: 'gettingstarted',
            password: 'postgres',
            autoLoadEntities: true,
            synchronize: true,
            logging: true,
        }),
        // GraphQLModule.forRoot<ApolloFederationDriverConfig>({
        //   driver: ApolloFederationDriver,
        //   // autoSchemaFile: join(process.cwd(), 'src/auth.schema.gql'),
        //   autoSchemaFile: true,
        // }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
        }),

        UserModule,
        DocumentsModule,
        FaqsModule,
        ServicesModule,
        BookingsModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AccessTokenGuard,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LogsMiddleware).forRoutes('*');
    }
}
