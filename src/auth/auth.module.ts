import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './utils/google.strategy';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { SessionSerializer } from './utils/serializer';
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [ 
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService
    },
    GoogleStrategy,
    SessionSerializer
],
})
export class AuthModule {}
