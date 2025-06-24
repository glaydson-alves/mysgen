import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Service } from 'src/services/entities/service.entity';
import { Enterprise } from 'src/enterprise/entities/enterprise.entity';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  imports: [
    TypeOrmModule.forFeature([Appointment, Service, Enterprise]),
  ],
})
export class AppointmentsModule {}
