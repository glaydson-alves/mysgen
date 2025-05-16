
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/guards/google.auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogle() { 
    return {msg: 'Google authentication initiated'} 
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req: any) {
    const { user, token } = req.user;

    return {
      message: 'Login successful',
      user,
      token: token.access_token,
    };
  }
}
