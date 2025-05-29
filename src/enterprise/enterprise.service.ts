import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enterprise } from './entities/enterprise.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { ResponseDto } from 'src/common/dto/response/response';

@Injectable()
export class EnterpriseService {
  constructor(
    @InjectRepository(Enterprise)
    private readonly enterpriseRespository: Repository<Enterprise>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createEnterprise(userId: number, createEnterpriseDto: CreateEnterpriseDto) {
    const existingEnterprise = await this.enterpriseRespository.findOne({ where: { user: { id: userId } } });
    if (existingEnterprise) {
      throw new BadRequestException('User already has an enterprise');
    }

    // verificar se tem token e se é valido, se nao tiver retorna um erro 

    const enterprise = this.enterpriseRespository.create({
      ...createEnterpriseDto,
      user: { id: userId },
    })
    await this.enterpriseRespository.save(enterprise);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.role = UserRole.ADMIN;
      await this.userRepository.save(user);
    }
    return new ResponseDto('Created successfully', enterprise);
  }

  // findAll() {
  //   return `This action returns all enterprise`;
  // }

  async findOne(id: number, userId: number) {
    const enterprise = await this.enterpriseRespository.findOne({
      where: {id},
      relations: ['user'],
    })
    if (!enterprise) {
      throw new BadRequestException(`Enterprise with ID ${id} not found`)
    }
    if (enterprise.user.id !== userId) {
      throw new ForbiddenException('You are not authorized to access this enterprise');
    }
    return new ResponseDto('Enterprise found', enterprise);
  }

  async update(id: number, updateEnterpriseDto: UpdateEnterpriseDto, userId: number) {
    const enterprise = await this.enterpriseRespository.findOne({ 
      where: { id },
      relations: ['user'],
    })
    if (!enterprise) {
      throw new BadRequestException(`Enterprise with ID ${id} not found`);
    }
  
    if (enterprise.user.id !== userId) {
      throw new ForbiddenException('You are not authorized to update this enterprise');
    }
  
    Object.assign(enterprise, updateEnterpriseDto);
    await this.enterpriseRespository.save(enterprise);
  
    return new ResponseDto('Enterprise updated successfully', enterprise);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} enterprise`;
  // }
}
