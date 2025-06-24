import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Between, In, Repository } from 'typeorm';
import { Service } from 'src/services/entities/service.entity';
import { Enterprise } from 'src/enterprise/entities/enterprise.entity';
import { ResponseDto } from 'src/common/dto/response/response';
import { User, UserRole } from 'src/users/entities/user.entity';

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
      service_id,
      scheduled_day: start,
      status: AppointmentStatus.ACTIVE
    });

    await this.appointmentRepository.save(appointment);
    return new ResponseDto('Appointment created successfully', appointment)
  }

  async findUserAppointments(userId: number) {
    const appointments = await this.appointmentRepository.find({
      where: { user: { id: userId }},
      relations: ['service'],
      order: { scheduled_day: 'ASC'}
    });
    return new ResponseDto('Your appointments', appointments)
  }

  async findAdminAppointments(userId: number) {
    try {
      const enterprise = await this.enterpriseRepository.findOne({
        where: { user_id: userId },
      });
  
      if (!enterprise) {
        throw new NotFoundException('Enterprise not found for this admin');
      }
  
      const services = await this.serviceRepository.find({
        where: { enterprise_id: enterprise.id },
      });
  
      const serviceIds = services.map((service) => service.id);
  
      const appointments = await this.appointmentRepository.find({
        where: {
          service: { id: In(serviceIds) },
          status: In([AppointmentStatus.ACTIVE, AppointmentStatus.RESCHEDULED]),
        },
        relations: ['user', 'service'],
        order: { scheduled_day: 'ASC' },
      });
  
      return new ResponseDto('Appointments loaded successfully', appointments);
    } catch (error) {
      console.error('findAdminAppointments error:', error);
      throw new InternalServerErrorException('Failed to load admin appointments');
    }
  }
  

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto, user: User) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'service'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (user.role !== UserRole.ADMIN && appointment.user.id !== user.id) {
      throw new ForbiddenException('User does not have permission for this action');
    };

    if (updateAppointmentDto.scheduled_day) {
      const start = new Date(updateAppointmentDto.scheduled_day)
      const end = new Date(start.getTime() + appointment.service.duration_minutes * 60000);

      const dayStart = new Date(start);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(start);
      dayEnd.setHours(23, 59, 59, 999);

      const appointments = await this.appointmentRepository.find({
        where: {
          scheduled_day: Between(dayStart, dayEnd),
          status: In([AppointmentStatus.ACTIVE, AppointmentStatus.RESCHEDULED]),
        },
        relations: ['service'],
      })

      const hasConflict = appointments.some((a) => {
        if (a.id === appointment.id) return false;
        const existingStart = new Date(a.scheduled_day);
        const existingEnd = new Date(existingStart.getTime() + a.service.duration_minutes * 60000);
        return start < existingEnd && end > existingStart;
      });
      
      if (hasConflict) {
        throw new BadRequestException('There is already a schedule in this time slot');
      }

      appointment.scheduled_day = start;
      
    }
    if (updateAppointmentDto.status) {
      appointment.status = updateAppointmentDto.status;
    }

    await this.appointmentRepository.save(appointment)
    return new ResponseDto('Appointment updated sucessfully', {
      id: appointment.id,
      user_id: appointment.user_id,
      service_id: appointment.service_id,
      scheduled_day: appointment.scheduled_day,
      status: appointment.status,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at,
    })
  }

  async cancel(id: number, user: User){
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!appointment){ 
      throw new NotFoundException('Appointment not found')
    };

    if (user.role !== UserRole.ADMIN && appointment.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to cancel this appointment');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    await this.appointmentRepository.save(appointment);
    return new ResponseDto('Appointment cancelled successfully', {
      id: appointment.id,
      user_id: appointment.user_id,
      service_id: appointment.service_id,
      scheduled_day: appointment.scheduled_day,
      status: appointment.status,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at,
    });
  }

  async remove(id: number, user: User) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
  
    if (user.role !== UserRole.ADMIN && appointment.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this appointment');
    }
  
    await this.appointmentRepository.delete(id);
    return new ResponseDto('Appointment deleted successfully', { id });
  }
  
}
