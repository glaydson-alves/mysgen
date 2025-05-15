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
      callbackURL: 'http://localhost:3000/api/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { displayName, emails, photos } = profile as any;
    const email = emails[0].value;
    const url_avatar = photos[0].value;

    const user = await this.authService.validateUser({
      email,
      displayName,
      url_avatar,
    });
    console.log('validate', user);
    return user || null;
  }
}
