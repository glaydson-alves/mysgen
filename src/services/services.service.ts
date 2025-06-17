import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Enterprise } from 'src/enterprise/entities/enterprise.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Enterprise)
    private readonly enterpirseRespository: Repository<Enterprise>
  ){}
  async create(enterprise_id: number, createServiceDto: CreateServiceDto) {
    const existingEnterprise = await this.enterpirseRespository.find({ where: { id: enterprise_id } })
    if (!existingEnterprise) {
      throw new BadRequestException(`Enterprise with ID ${enterprise_id} not found`);
    }
    // const newService = this.servicesRepository.create({
    //   ...CreateServiceDto,
    //   enterprise,
    // })
  }

  findAll() {
    return `This action returns all services`;
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
