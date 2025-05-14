import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDatails } from 'utils/types';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: 
        Repository<User>,
    ) {}

    async validateUser(details: UserDatails) {
        const user = await this.userRepository.findOneBy({
            email: details.email
        });
        console.log('log aqui validateUser', user);
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

}
