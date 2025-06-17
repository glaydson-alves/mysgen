import { Controller, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/utils/guards/jwt.auth.guard';
import { IRequestWithUser } from 'src/common/interface/request-with-user.interface';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMe(@Body() updateUserDto: UpdateUserDto, @Req() req: IRequestWithUser) {
    const user = req.user as {id: number}
    return this.usersService.update(user.id, updateUserDto);
  }

}
