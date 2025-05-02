import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type UserRole = 'admin' | 'user';

@Entity('user')
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'full_name'})
    fullName: string;

    @Column({name: 'email'})
    email: string;

    @Column({name: 'password'})
    password: string;

    @Column({type: 'enum', enum: ['admin', 'user'], default: 'user'})
    role: UserRole;

    @Column({name: 'url_avatar'})
    urlAvatar: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}


