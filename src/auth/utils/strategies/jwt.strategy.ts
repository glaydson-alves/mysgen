import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from 'utils/types';
import { AuthService } from '../../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService

    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET as string,
            ignoreExpiration: false,
        });
    }
    
    validate(payload: AuthJwtPayload) {
        const userId = payload.sub;
        return this.authService.validateJwtUser(userId);
    }
}
