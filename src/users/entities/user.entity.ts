import { Enterprise } from "src/enterprise/entities/enterprise.entity";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Appointment } from 'src/appointments/entities/appointment.entity';

export  enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Entity('users')
export class User {
    // @PrimaryGeneratedColumn('uuid')
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    displayName: string;

    @Column({ nullable: false })
    email: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @Column({ default: '', type: 'text' })
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
