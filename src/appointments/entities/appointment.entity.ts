import { Service } from "src/services/entities/service.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

export enum AppointmentStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    RESCHEDULED = 'rescheduled',
    COMPLETED = 'completed',
}

@Entity('appointment')
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;
  
    @ManyToOne(() => User, (user) => user.appointments)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column()
    service_id: string;
  
    @ManyToOne(() => Service, (service) => service.appointment)
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @Column()
    scheduled_day: Date;

    @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.ACTIVE })
    status: AppointmentStatus;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
}
