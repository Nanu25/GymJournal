// TrainingExercise.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Training } from './Training';
import { Exercise } from './Exercise';

@Entity('training_exercises')
export class TrainingExercise {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column()
    weight!: number;

    @Column({ type: 'integer' })
    trainingId!: number;

    @Column({ type: 'integer' })
    exerciseId!: number;

    @ManyToOne(() => Training, training => training.trainingExercises)
    @JoinColumn({ name: 'trainingId' })
    training!: Training;

    @ManyToOne(() => Exercise, exercise => exercise.trainingExercises)
    @JoinColumn({ name: 'exerciseId' })
    exercise!: Exercise;
}