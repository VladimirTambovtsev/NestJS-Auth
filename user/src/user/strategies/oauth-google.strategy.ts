import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy} from 'passport-google-oauth20';

// TODO: move to .env, add joi
export const JWT_ACCESS_TOKEN_SECRET = `89bf192b2b6468668da83dff4f0bc2d17908644894327050-~[JK;XKk6$/7U!G}@7*~ud$EdL,5WY+e!eGSHs5%?"qaDXM@m3):nZE8/S~M%<bSKjf3s'~8db718310df2c2defdb22fab6731fd544bb3d534fefe16c5414093a20b2e3b9fdd011887442b0789+kDcD8*yw>Wr'7%XXc=v9$Ag#23fe59bafc89daf4eba0d84585a2090976efac9fee0e3d1b91324a89b1d33e6a96cc5904ddddeb4d1b58ce0f549cbc52f0227a28833652c0cf1342482583adc9q3%A^d!]w9Z/3wT,%F*$)xj}r`;

// interface IGoogleProfile {
//     name: string;
//     email: string;
//     photos: string;
// }

@Injectable()
export class OAuthGoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: '675729104119-38nj6jqdgq9d63g0d5chm8o0h9bo78e7.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/oauth/auth/google/callback',
            scope: ['email', 'profile'],
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // secretOrKey: JWT_ACCESS_TOKEN_SECRET,
        });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
        const {name, emails, photos} = profile;
        const user = {
            email: emails[0].value,
            firstname: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
        };
        done(null, user);
    }
    // validate(payload: IJwtPayload) {
    //     return payload;
    // }
}
