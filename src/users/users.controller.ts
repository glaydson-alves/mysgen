import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/utils/guards/jwt.auth.guard';
import { RequestWithUser } from 'src/common/interface/request-with-user';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Body() updateUserDto: UpdateUserDto, @Req() req: RequestWithUser) {
    const user = req.user as {id: number}
    return this.usersService.update(user.id, updateUserDto);
  }

}
