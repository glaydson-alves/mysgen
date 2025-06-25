import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './utils/strategies/google.strategy';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [ 
    GoogleStrategy,
    JwtStrategy,
    AuthService,
  ],
})
export class AuthModule {}
