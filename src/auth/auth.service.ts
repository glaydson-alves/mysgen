import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CurrentUser, UserDatails } from 'utils/types';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: 
        Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(details: UserDatails) {
        const user = await this.userRepository.findOneBy({
            email: details.email
        });
        if (user) return user;

        const newUser = this.userRepository.create(details);
        return this.userRepository.save(newUser);
    }

    async findUser(id: string) {
        const user = await this.userRepository.findOneBy({ id });
        if (user) {
            return user;
        }
        return null;
    }

    async generateJwt(user: User) {
        const payload = {
            sub: user.id,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
        } 
    }

    async validateJwtUser(id: string) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new UnauthorizedException('User not found!');
        const currentUser: CurrentUser = { id: user.id, role: user.role };
        return currentUser;
    }

}
