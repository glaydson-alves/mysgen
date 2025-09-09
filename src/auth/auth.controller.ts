import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthGuard } from './utils/guards/google.auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './utils/guards/jwt.auth.guard';
import { IRequestWithUser } from 'src/common/interface/request-with-user.interface';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogle() {
    return { msg: 'Google authentication initiated' }
  }
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req: any, @Res() res: Response) {
    const { user, token, hasEnterprise } = req.user;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const redirectUrl = `${frontendUrl}/auth/google/callback?access_token=${token.access_token}&refresh_token=${token.refresh_token}&user=${user.id}&e=${hasEnterprise ? 'y' : 'n'}`;
    res.redirect(redirectUrl);
  }
  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    const user = await this.authService.validateRefreshToken(body.refresh_token);
    return this.authService.generateJwt(user);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: IRequestWithUser) {
    return this.usersService.findOneWithRelations(req.user.id);
  }
}
