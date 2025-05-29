import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number){
    const user = await this.userRepository.findOne({where: {id}})
    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`)
    }
    return new ResponseDto('User updated successfully', user);
  }


  async update(id: number, updateUserDto: UpdateUserDto){
    const user = await this.userRepository.findOne({where: {id}})
    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found`)
    }
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return new ResponseDto('User updated successfully', user);
  }

  
}
