import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/utils/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/utils/guards/roles.guard';
import { Roles } from 'src/auth/utils/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('create')
  @Roles(UserRole.ADMIN)
  create(@Body() createServiceDto: CreateServiceDto) {
    const { enterprise_id } = createServiceDto;
    return this.servicesService.create(enterprise_id,createServiceDto);
  }

  @Get('all')
  //aqui é uma rota publica
  findAll(@Query('enterprise_id') enterpriseId: number) {
    return this.servicesService.findAll(+enterpriseId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
