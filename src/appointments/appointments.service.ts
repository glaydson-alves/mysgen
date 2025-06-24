import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { Service } from 'src/services/entities/service.entity';
import { Enterprise } from 'src/enterprise/entities/enterprise.entity';
import { ResponseDto } from 'src/common/dto/response/response';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
  ){}

  async create(userId: number, appointmentDto: CreateAppointmentDto) {
    if (!appointmentDto || Object.keys(appointmentDto).length === 0) {
      throw new BadRequestException('Empty scheduling data')
    }
    const { service_id, scheduled_day } = appointmentDto;
    if (!service_id || isNaN(Number(service_id))) {
      throw new BadRequestException('Invalid service_id');
    }
    if (!scheduled_day) {
      throw new BadRequestException('scheduled_day is required');
    }

    const service = await this.serviceRepository.findOne({
      where: {id:service_id}
    });

    if (!service) { throw new NotFoundException('Service not found')};

    const appointment = this.appointmentRepository.create({
      ...appointmentDto,
      user_id: userId,
      service_id: service_id,
    })

    await this.appointmentRepository.save(appointment);
    return new ResponseDto('Appointment created successfully', appointment)
  }

  findUserAppointments() {

  }

  findAdminAppointments() {

  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
