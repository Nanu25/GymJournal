// Training.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { TrainingExercise } from './TrainingExercise';

@Entity('trainings')
export class Training extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'date' })
    date!: Date;

    @ManyToOne(() => User, user => user.trainings)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ type: 'integer' })
    userId!: number;

    @OneToMany(() => TrainingExercise, trainingExercise => trainingExercise.training, {
        cascade: true
    })
    trainingExercises!: TrainingExercise[];
}