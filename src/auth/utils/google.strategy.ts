import { AuthService } from './../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
   @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3306/api/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos } = profile as any;
    const email = emails[0].value;
    const url_avatar = photos[0].value;

    const user = await this.authService.validateUser({
      email,
      displayName,
      url_avatar,
    });
    console.log('validate', user);
    return done(null, user);

    // if (!user) {
    //   console.log('Usuário não encontrado ou erro na validação.');
    //   return done(new UnauthorizedException('Usuário não autorizado'));
    // }
    // console.log('user em strategy', user);
    // return done(null, user);
  }
}
