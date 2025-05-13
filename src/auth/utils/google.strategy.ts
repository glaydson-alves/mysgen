import { AuthService } from './../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
   @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
      callbackURL: 'http://localhost:3306/api/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ){
    const { displayName, emails, photos } = profile as any;
    const email = emails[0].value;
    const url_avatar = photos[0].value;
    console.log('profile', profile);
    console.log("accessaToken",accessToken)
    console.log("refreshToken",refreshToken)
    console.log("done",done)

    const user = this.authService.validateUser({
      email,
      displayName,
      url_avatar,
    });
    console.log('user', user);
    return user || null;
    
    // const email = emails[0].value;

    // let user = await this.usersService.findByEmail(email);

    // if (!user) {
    //   user = await this.usersService.createWithGoogle({
    //     email,
    //     firstName: name.givenName,
    //     lastName: name.familyName,
    //     picture: photos[0].value,
    //     provider: 'google',
    //   });
    // }

    // done(null, user);
  }
}
