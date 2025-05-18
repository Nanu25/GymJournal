// TrainingExercise.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Training } from './Training';
import { Exercise } from './Exercise';

@Entity('training_exercises')
export class TrainingExercise {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    weight!: number;

    @Column()
    trainingId!: string;

    @Column()
    exerciseId!: string;

    @ManyToOne(() => Training, training => training.trainingExercises)
    @JoinColumn({ name: 'trainingId' })
    training!: Training;

    @ManyToOne(() => Exercise, exercise => exercise.trainingExercises)
    @JoinColumn({ name: 'exerciseId' })
    exercise!: Exercise;
}