import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export enum ActionType {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete'
}

@Entity('activity_logs')
export class ActivityLog {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({
        type: 'enum',
        enum: ActionType
    })
    action!: ActionType;

    @Column()
    entityType!: string;

    @Column({ type: 'uuid', nullable: true })
    entityId!: string | null;

    @Column({ type: 'jsonb', nullable: true })
    details!: Record<string, any>;

    @CreateDateColumn()
    timestamp!: Date;
} 