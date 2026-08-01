import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { TrainingExercise } from './TrainingExercise';

@Entity('trainings')
export class Training extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'date' })
    date!: Date;

    @ManyToOne(() => User, (user: User) => user.trainings)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ type: 'uuid' })
    userId!: string;

    @Column({ type: 'jsonb', nullable: true })
    exercises!: Record<string, number> | null;

    @OneToMany(() => TrainingExercise, (trainingExercise: TrainingExercise) => trainingExercise.training, {
        cascade: true
    })
    trainingExercises!: TrainingExercise[];
}