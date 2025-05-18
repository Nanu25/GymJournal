// Exercise.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TrainingExercise } from './TrainingExercise';

@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    muscleGroup!: string;

    @OneToMany(() => TrainingExercise, trainingExercise => trainingExercise.exercise)
    trainingExercises!: TrainingExercise[];
}