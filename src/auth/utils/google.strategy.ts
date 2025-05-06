import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
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
    const { name, emails, photos } = profile;
    console.log('profile', profile);
    console.log("accessaToken",accessToken)
    console.log("refreshToken",refreshToken)
    console.log("done",done)
    
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
