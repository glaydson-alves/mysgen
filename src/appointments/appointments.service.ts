import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Between, In, Repository } from 'typeorm';
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

    const service = await this.serviceRepository.findOne({ where: {id:service_id}});
    if (!service) { throw new NotFoundException('Service not found')};
    const start = new Date(scheduled_day);
    const end = new Date(start.getTime() + service.duration_minutes * 60000);
  
    const dayStart = new Date(start);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(start);
    dayEnd.setHours(23, 59, 59, 999);

    const sameDayAppointments = await this.appointmentRepository.find({
      relations: ['service'],
      where: {
        scheduled_day: Between(dayStart, dayEnd),
        status: In([AppointmentStatus.ACTIVE, AppointmentStatus.RESCHEDULED])
      }
    }) 

    const hasConflict = sameDayAppointments.some(existing => {
      const existingStart = new Date(existing.scheduled_day);
      const existingEnd = new Date(existingStart.getTime() + service.duration_minutes * 60000);
      return start < existingEnd && end > existingStart;
    })

    if (hasConflict) {
      throw new BadRequestException('There is already a schedule in this time slot');
    }

    const appointment = this.appointmentRepository.create({
      user_id: userId,
      service_id: service_id,
      scheduled_day: start,
      status: AppointmentStatus.ACTIVE
    });

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
