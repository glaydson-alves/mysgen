import { Enterprise } from "src/enterprise/entities/enterprise.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Appointment } from 'src/appointments/entities/appointment.entity';

export  enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    password_hash: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @Column()
    url_avatar: string;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;

    @OneToOne(() => Enterprise, (enterprise) => enterprise.user)
    enterprise: Enterprise; 

    @OneToMany(() => Appointment, (appointment) => appointment.user)
    appointments: Appointment[];
}
