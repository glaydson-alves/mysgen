import { Appointment } from "src/appointments/entities/appointment.entity";
import { Enterprise } from "src/enterprise/entities/enterprise.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('service')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    enterprise_id: string;

    @ManyToOne(() => Enterprise, (enterprise) => enterprise.services)
    @JoinColumn({ name: 'enterprise_id' })
    enterprise: Enterprise;

    @Column()
    name: string;

    @Column('float')
    price: number;
    
    @Column()
    description: string;

    @Column()
    duration_minutes: number;

    @Column()
    image_url: string;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Appointment, (appointment) => appointment.service)
    appointment: Appointment[];
}

