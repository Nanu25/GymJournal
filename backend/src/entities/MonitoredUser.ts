import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('monitored_users')
export class MonitoredUser {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @Column()
    username!: string;

    @Column()
    reason!: string;

    @CreateDateColumn()
    detectedAt!: Date;
} 