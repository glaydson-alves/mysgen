import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ResponseDto } from 'src/common/dto/response/response';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async update(id: number, updateUserDto: UpdateUserDto){
    
    if (!updateUserDto  || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('Update data cannot be empty');
    }

    if(!updateUserDto.url_avatar){
      delete updateUserDto.url_avatar
    }
    if(!updateUserDto.displayName){
      delete updateUserDto.displayName
    }
    try {
      const result = await this.userRepository.update(id, updateUserDto);
      if (result.affected === 0) {
        throw new BadRequestException(`User with id${id} not found`)
      }
      const user = await this.userRepository.findOne({where: {id}});

      return new ResponseDto('User updated successfully', user);
    } catch (error) {
      throw new BadGatewayException('Failed to update user')
    }
  }

  
}
