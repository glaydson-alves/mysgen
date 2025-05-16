import { BadRequestException, Injectable } from '@nestjs/common';
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
    console.log('Enterprise created:', enterprise, new ResponseDto('Created successfully', enterprise));
    return new ResponseDto('Created successfully', enterprise);
  }

  findAll() {
    return `This action returns all enterprise`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enterprise`;
  }

  update(id: number, updateEnterpriseDto: UpdateEnterpriseDto) {
    return `This action updates a #${id} enterprise`;
  }

  remove(id: number) {
    return `This action removes a #${id} enterprise`;
  }
}
