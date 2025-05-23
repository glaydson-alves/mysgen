import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto } from './dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';
import { JwtAuthGuard } from 'src/auth/utils/guards/jwt.auth.guard';

@Controller('enterprise')
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createEnterprise(@Req() req, @Body() createEnterpriseDto: CreateEnterpriseDto) {
    const userId = req.user.id as number;
    const enterprise = await this.enterpriseService.createEnterprise(userId, createEnterpriseDto);
    return enterprise;
    
  }
  

  // @Get()
  // findAll() {
  //   return this.enterpriseService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.enterpriseService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEnterpriseDto: UpdateEnterpriseDto) {
  //   return this.enterpriseService.update(+id, updateEnterpriseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.enterpriseService.remove(+id);
  // }
}
