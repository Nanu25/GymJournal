import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 100 })
    name!: string;

    @Column({ unique: true, length: 100 })
    email!: string;

    @Column()
    password!: string;

    @Column({ type: 'float', nullable: true })
    weight?: number;

    @Column({ type: 'float', nullable: true })
    height?: number;

    @Column({ length: 20, nullable: true })
    gender?: string;

    @Column({ type: 'int', nullable: true })
    age?: number;

    @Column({ type: 'int', nullable: true })
    timesPerWeek?: number;

    @Column({ type: 'int', nullable: true })
    timePerSession?: number;

    @Column({ length: 20, nullable: true })
    repRange?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 