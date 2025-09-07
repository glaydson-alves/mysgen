import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { ServicesModule } from './services/services.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: process.env.DB_HOST,
      host: 'localhost',
      // port: process.env.DB_PORT as any,
      // para dev
      port: 3306,
      // username: process.env.DB_USERNAME,
      username: 'root',
      // password: process.env.DB_PASSWORD,
      password: '',
      // database: process.env.DB_NAME,
      database: 'vitrinepro',
      entities: [User],
      autoLoadEntities: true,
      synchronize: true,
      // para Dev
      logging: true,
    }),
    UsersModule,
    EnterpriseModule,
    ServicesModule,
    AppointmentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
