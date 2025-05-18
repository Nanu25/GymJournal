// Exercise.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TrainingExercise } from './TrainingExercise';

@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column()
    name!: string;

    @Column()
    muscleGroup!: string;

    @OneToMany(() => TrainingExercise, trainingExercise => trainingExercise.exercise)
    trainingExercises!: TrainingExercise[];
}