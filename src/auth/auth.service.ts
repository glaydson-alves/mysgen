import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CurrentUser, UserDatails } from 'src/common/types/types';

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

    async findUser(id: number) {
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
        const access_token = this.jwtService.sign(payload, {
            expiresIn: '15m',
        })

        const refresh_token = this.jwtService.sign(payload, {
            expiresIn: '7d',
        })

        return { access_token, refresh_token }; 
    }

    async validateJwtUser(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new UnauthorizedException('User not found!');
        const currentUser: CurrentUser = { id: user.id, role: user.role };
        return currentUser;
    }

    async validateRefreshToken(refreshToken: string) {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            const user =await this.findUser(decoded.sub);
            if (!user) { throw new UnauthorizedException() };
            return user;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token', error);
        }
    }
}
