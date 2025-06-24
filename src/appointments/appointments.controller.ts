import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Roles } from 'src/auth/utils/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/utils/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/utils/guards/roles.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.USER)
  create(@Req() req: any, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.id, createAppointmentDto);
  }

  @Get('all')
  @Roles(UserRole.ADMIN)
  findAdminAppointments(@Req() req: any) {
    return this.appointmentsService.findAdminAppointments(req.user.id);
  }

  @Get('me')
  findUserAppointments(@Req() req: any) {
    return this.appointmentsService.findUserAppointments(req.user.id);
  }
  
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAppointmentDto: UpdateAppointmentDto, @Req() req: any) {
    return this.appointmentsService.update(+id, updateAppointmentDto, req.user);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: number, @Req() req: any) {
    return this.appointmentsService.cancel(+id, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
