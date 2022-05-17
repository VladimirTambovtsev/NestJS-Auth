import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {TypeOrmModule} from '@nestjs/typeorm';

import {User} from './entities/user.entity';
import {AccessTokenStrategy, RefreshTokenStrategy} from './strategies';
import {OAuthGoogleStrategy} from './strategies/oauth-google.strategy';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
    imports: [
        JwtModule.register({}),
        TypeOrmModule.forFeature([User]),
        ClientsModule.register([
            {
                name: 'KAFKA_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: ['pkc-4ygn6.europe-west3.gcp.confluent.cloud:9092'],
                        ssl: true,
                        sasl: {
                            mechanism: 'plain',
                            username: 'PP6WEWYOYYZ35H3V',
                            password: 'g92IuFKUrDMCjl0Y/KcjYE4ndZB5GDgj+sZI0FAWAq5y7/5Vh54yek9IRwYVzR+/',
                        },
                    },
                },
            },
        ]),
    ],
    controllers: [UserController],
    providers: [UserService, RefreshTokenStrategy, AccessTokenStrategy, OAuthGoogleStrategy],
})
export class UserModule {}
