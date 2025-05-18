// Training.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { TrainingExercise } from './TrainingExercise';

@Entity('trainings')
export class Training extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ type: 'date' })
    date!: Date;

    @ManyToOne(() => User, user => user.trainings)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column({ type: 'integer' })
    userId!: number;
    
    @Column({ type: 'jsonb', nullable: true })
    exercises!: Record<string, number> | null;

    @OneToMany(() => TrainingExercise, trainingExercise => trainingExercise.training, {
        cascade: true
    })
    trainingExercises!: TrainingExercise[];
}