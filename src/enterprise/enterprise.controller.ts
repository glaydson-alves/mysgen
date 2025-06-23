import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { JwtAuthGuard } from 'src/auth/utils/guards/jwt.auth.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/utils/decorators/roles.decorator';

@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createEnterprise(@Req() req: any, @Body() createEnterpriseDto: CreateEnterpriseDto) {
    const userId = req.user.id as number;
    const enterprise = await this.enterpriseService.createEnterprise(userId, createEnterpriseDto);
    return enterprise;
    
  }
  

  // @Get()
  // findAll() {
  //   return this.enterpriseService.findAll();
  // }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user.id as number;
    return this.enterpriseService.findOne(+id, +userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateEnterpriseDto: UpdateEnterpriseDto,
    @Req() req: any,
  ) {
    const userId = req.user.id as number;
    return this.enterpriseService.update(+id, updateEnterpriseDto, userId);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.enterpriseService.remove(+id);
  // }
}
