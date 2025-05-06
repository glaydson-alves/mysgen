import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/google.auth.guard';

@Controller('auth')
export class AuthController {
  constructor() {}
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogle() { 
    return {msg: 'Google authentication initiated'} 
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return {msg: 'Google ok'}
  }
}
