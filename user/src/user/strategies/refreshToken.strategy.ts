import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Request} from 'express';
import {ExtractJwt, Strategy} from 'passport-jwt';

import {IJwtPayload} from '../types';

// TODO: move to .env, add joi
export const JWT_REFRESH_TOKEN_SECRET = `bbb6891861a6d735a7e9649fd03f3ccc2f7f43b30db0b49f37f7ee732976bf591b774868082c2f665827932625c76bb5ac05bb91d080a25c7aef3c38ad471033D&Y2Kwkbvs9Q/=uUE,7hSB-5<tFKc@VHe/6s^K)gnwygW/Qp}=N%}*yf+K.:'e{N~<_<RA;"Uz+_N3{4aeea86ee81e382c6241c53bbba84235c31e0fc4d67e49a33-{Yp'vC'w:3bXS7D,M2fguGbKV2KZR&w%x9cH-<S{jv-N2xqZ#nkn,?_9fP%%C@m_z6~k&qG$%E7baa6450ae55903acf5e9831f755a3bc33a48306c06b5ce5a00d1ed6d09ab2a7962a224f2c5c71f7g69`;

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_REFRESH_TOKEN_SECRET,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: IJwtPayload) {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        return {...payload, refreshToken};
    }
}
