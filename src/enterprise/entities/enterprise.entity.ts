import { Service } from "src/services/entities/service.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('enterprise')
export class Enterprise {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @OneToOne(() => User, (user) => user.enterprise)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    public_name: string;

    @Column()
    address: string;

    @Column()
    logo_url: string;

    @Column()
    banner_url: string;

    @Column({ type: 'time' })
    opening_time: string;

    @Column({ type: 'time' })
    closing_time: string;

    @Column()
    closed_days: string;

    @Column()
    slug: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Service, (service) => service.enterprise)
    services: Service[];
}
