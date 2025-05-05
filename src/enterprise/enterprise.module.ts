import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enterprise } from './entities/enterprise.entity';

@Module({
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
  imports: [
    TypeOrmModule.forFeature([Enterprise]),
  ],
})
export class EnterpriseModule {}
