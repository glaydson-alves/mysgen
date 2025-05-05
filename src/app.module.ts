import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { ServicesModule } from './services/services.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3000,
      username: '************',
      password: '************',
      database: '************',
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    EnterpriseModule,
    ServicesModule,
    AppointmentsModule,  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
