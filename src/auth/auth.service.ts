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
        console.log('AuthService');
        console.log(details);
        const user = await this.userRepository.findOneBy({
            email: details.email
        });
        if (user) {
            console.log('user', user);
            return user;
        }
        const newUser = this.userRepository.create(details);
        return this.userRepository.save(newUser);
    }
    // async validateUser(username: string, pass: string): Promise<any> {
    //   const user = await this.usersService.findOne(username);
    //   if (user && user.password === pass) {
    //     const { password, ...result } = user;
    //     return result;
    //   }
    //   return null;
    // }
}
