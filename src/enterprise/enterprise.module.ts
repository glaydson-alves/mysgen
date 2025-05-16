import { Module } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enterprise } from './entities/enterprise.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
  imports: [
    TypeOrmModule.forFeature([Enterprise, User]),
    UsersModule
  ],
})
export class EnterpriseModule {}
