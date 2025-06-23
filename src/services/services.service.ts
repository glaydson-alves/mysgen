import { BadGatewayException, BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Enterprise } from 'src/enterprise/entities/enterprise.entity';
import { ResponseDto } from 'src/common/dto/response/response';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>
  ){}
  async create(enterprise_id: number, createServiceDto: CreateServiceDto) {
    const existingEnterprise = await this.enterpriseRepository.findOne({ where: { id: enterprise_id } });
    if (!existingEnterprise) {
      throw new BadRequestException(`Enterprise with ID ${enterprise_id} not found`);
    }
  
    const { enterprise_id: _, ...rest } = createServiceDto;
    const newService = this.servicesRepository.create({
      ...rest,
      enterprise: { id: enterprise_id },
    });
  
    await this.servicesRepository.save(newService);
    return new ResponseDto('Service created successfully', newService);
  }

  async findAll(enterprise_id: number) {
    const enterprise = await this.enterpriseRepository.findOne({
      where: { id: enterprise_id },
    });
  
    if (!enterprise) {
      throw new NotFoundException('Enterprise not found');
    }

    const allServices = await this.servicesRepository.find({
      where: {
        enterprise: {id: enterprise_id}
      },
      order:{
        created_at: 'DESC'
      }
    })
    return new ResponseDto('Services loaded', allServices);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    if (!updateServiceDto || Object.keys(updateServiceDto).length === 0) {
      throw new BadRequestException('Update data cannot be empty');
    }
    if (!updateServiceDto.name) {
      delete updateServiceDto.name;
    }
    if (!updateServiceDto.price) {
      delete updateServiceDto.price;
    }
    if (!updateServiceDto.description) {
      delete updateServiceDto.description;
    }
    if (!updateServiceDto.duration_minutes) {
      delete updateServiceDto.duration_minutes;
    }
    if (!updateServiceDto.image_url) {
      delete updateServiceDto.image_url;
    }
    try {
      const result = await this.servicesRepository.update(id, updateServiceDto);
      if (result.affected === 0) {
        throw new BadRequestException(`Service with ID ${id} not found`);
      }
      const updatedService = await this.servicesRepository.findOne({ where: { id } });
      const response = {
        name: updatedService?.name,
        price: updatedService?.price,
        description: updatedService?.description,
        duration_minutes: updatedService?.duration_minutes,
        image_url: updatedService?.image_url
      }
      return new ResponseDto('Service updated successfully', response)

    } catch (error) {
      throw new BadGatewayException('Failed to update service');
    }
  }

  async remove(serviceId: number) {
    const service = await this.servicesRepository.findOne({
      where: { id:serviceId },
      relations: ['enterprise', 'enterprise.user'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`)
    }
    const enterprise = await this.enterpriseRepository.findOne({
      where: { id: service.enterprise.id },
      relations: ['user']
    })
    if (!enterprise || enterprise.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to delete this service')
    };
    await this.servicesRepository.remove(service)
    return new ResponseDto('Service removed successfully')
  }
}
