import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';

import {IJwtPayload} from '../types';

// TODO: move to .env, add joi
export const JWT_ACCESS_TOKEN_SECRET = `89bf192b2b6468668da83dff4f0bc2d17908644894327050-~[JK;XKk6$/7U!G}@7*~ud$EdL,5WY+e!eGSHs5%?"qaDXM@m3):nZE8/S~M%<bSKjf3s'~8db718310df2c2defdb22fab6731fd544bb3d534fefe16c5414093a20b2e3b9fdd011887442b0789+kDcD8*yw>Wr'7%XXc=v9$Ag#23fe59bafc89daf4eba0d84585a2090976efac9fee0e3d1b91324a89b1d33e6a96cc5904ddddeb4d1b58ce0f549cbc52f0227a28833652c0cf1342482583adc9q3%A^d!]w9Z/3wT,%F*$)xj}r`;

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_ACCESS_TOKEN_SECRET,
        });
    }

    validate(payload: IJwtPayload) {
        return payload;
    }
}
