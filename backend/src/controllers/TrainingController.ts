import { Request, Response } from 'express';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';
import { TrainingExercise } from '../entities/TrainingExercise';
import { AppDataSource } from '../config/database';
import { Between } from 'typeorm';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

interface FormattedTraining {
    date: string;
    exercises: { [key: string]: number };
}

const trainingRepository = AppDataSource.getRepository(Training);
const exerciseRepository = AppDataSource.getRepository(Exercise);
const trainingExerciseRepository = AppDataSource.getRepository(TrainingExercise);

export const getAllTrainings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { searchTerm, sortField, sortDirection } = req.query;

        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        // Create query builder
        const queryBuilder = AppDataSource
            .getRepository(Training)
            .createQueryBuilder('training')
            .leftJoinAndSelect('training.trainingExercises', 'trainingExercise')
            .leftJoinAndSelect('trainingExercise.exercise', 'exercise')
            .where('training.userId = :userId', { userId: req.user.id });

        // Apply filter if searchTerm exists
        if (searchTerm) {
            const term = `%${searchTerm}%`;
            queryBuilder.andWhere(
                '(CAST(training.date AS TEXT) LIKE :term OR exercise.name LIKE :term)',
                { term }
            );
        }

        // Apply sorting
        if (sortField === 'date') {
            queryBuilder.orderBy('training.date', sortDirection === 'asc' ? 'ASC' : 'DESC');
        }

        const trainings = await queryBuilder.getMany();

        // Transform data to match frontend expectations
        const formattedTrainings: FormattedTraining[] = trainings.map((training: Training) => {
            const exercises: { [key: string]: number } = {};

            training.trainingExercises.forEach((te: TrainingExercise) => {
                exercises[te.exercise.name] = te.weight;
            });

            // Ensure date is properly formatted
            const date = training.date instanceof Date 
                ? training.date.toISOString().split('T')[0]
                : new Date(training.date).toISOString().split('T')[0];

            return {
                date,
                exercises
            };
        });

        // Apply additional sorting that requires the transformed data
        if (sortField === 'pr') {
            formattedTrainings.sort((a: FormattedTraining, b: FormattedTraining) => {
                const prA = Object.values(a.exercises).length > 0 ? Math.max(...Object.values(a.exercises).map(Number)) : 0;
                const prB = Object.values(b.exercises).length > 0 ? Math.max(...Object.values(b.exercises).map(Number)) : 0;
                return sortDirection === 'asc' ? prA - prB : prB - prA;
            });
        } else if (sortField === 'exercises') {
            formattedTrainings.sort((a: FormattedTraining, b: FormattedTraining) => {
                const comparison = Object.keys(a.exercises).length - Object.keys(b.exercises).length;
                return sortDirection === 'asc' ? comparison : -comparison;
            });
        }

        res.status(200).json(formattedTrainings);
    } catch (error) {
        console.error('Error fetching trainings:', error);
        res.status(500).json({ message: 'Error fetching trainings' });
    }
};

export const createTraining = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Request body:', req.body);
        console.log('User:', req.user);

        const { date, exercises } = req.body;

        // Validate required fields
        if (!date) {
            console.error('Missing date in request');
            res.status(400).json({ message: 'Date is required' });
            return;
        }

        if (!exercises || Object.keys(exercises).length === 0) {
            console.error('Missing exercises in request');
            res.status(400).json({ message: 'At least one exercise is required' });
            return;
        }

        if (!req.user?.id) {
            console.error('No user ID found in request');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        // Create new training
        const training = new Training();
        training.date = new Date(date);
        training.userId = req.user.id;

        console.log('Creating training with data:', {
            date: training.date,
            userId: training.userId
        });

        // Save training first to get ID
        const savedTraining = await trainingRepository.save(training);
        console.log('Saved training:', savedTraining);

        // Process exercises
        const trainingExercises: TrainingExercise[] = [];

        for (const [exerciseName, weight] of Object.entries(exercises)) {
            console.log('Processing exercise:', { exerciseName, weight });

            if (isNaN(Number(weight)) || Number(weight) <= 0) {
                console.warn(`Invalid weight for exercise ${exerciseName}: ${weight}`);
                continue;
            }

            // Find or create exercise
            let exercise = await exerciseRepository.findOne({ where: { name: exerciseName } });
            if (!exercise) {
                console.log(`Creating new exercise: ${exerciseName}`);
                exercise = new Exercise();
                exercise.name = exerciseName;
                exercise.muscleGroup = 'Other'; // Default muscle group
                await exerciseRepository.save(exercise);
            }

            // Create training exercise relationship
            const trainingExercise = new TrainingExercise();
            trainingExercise.training = savedTraining;
            trainingExercise.exercise = exercise;
            trainingExercise.weight = Number(weight);
            trainingExercise.trainingId = savedTraining.id;
            trainingExercise.exerciseId = exercise.id;

            trainingExercises.push(trainingExercise);
        }

        if (trainingExercises.length === 0) {
            console.error('No valid exercises to save');
            // Clean up the training if no exercises were valid
            await trainingRepository.remove(savedTraining);
            res.status(400).json({ message: 'No valid exercises provided' });
            return;
        }

        // Save all training exercises
        console.log('Saving training exercises:', trainingExercises);
        await trainingExerciseRepository.save(trainingExercises);

        // Return formatted response
        const formattedExercises: { [key: string]: number } = {};
        trainingExercises.forEach(te => {
            formattedExercises[te.exercise.name] = te.weight;
        });

        res.status(201).json({
            id: savedTraining.id,
            date: savedTraining.date.toISOString().split('T')[0],
            exercises: formattedExercises
        });
    } catch (error) {
        console.error('Detailed error creating training:', error);
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
        }
        res.status(500).json({ 
            message: 'Error creating training', 
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error instanceof Error ? error.stack : undefined
        });
    }
};

export const deleteTraining = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date } = req.params;
        const trainingDate = new Date(date);
        const training = await trainingRepository.findOne({ 
            where: { 
                date: Between(
                    new Date(trainingDate.setHours(0, 0, 0, 0)),
                    new Date(trainingDate.setHours(23, 59, 59, 999))
                )
            } 
        });
        
        if (!training) {
            res.status(404).json({ message: 'Training not found' });
            return;
        }

        await trainingRepository.remove(training);
        res.status(200).json({ message: 'Training deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting training', error });
    }
};

export const updateTrainingByDate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date } = req.params;
        const trainingDate = new Date(date);
        const training = await trainingRepository.findOne({ 
            where: { 
                date: Between(
                    new Date(trainingDate.setHours(0, 0, 0, 0)),
                    new Date(trainingDate.setHours(23, 59, 59, 999))
                )
            } 
        });
        
        if (!training) {
            res.status(404).json({ message: 'Training not found' });
            return;
        }

        Object.assign(training, req.body);
        const updatedTraining = await trainingRepository.save(training);
        res.status(200).json(updatedTraining);
    } catch (error) {
        res.status(500).json({ message: 'Error updating training', error });
    }
};

export const getMuscleGroupDistribution = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const trainings = await trainingRepository.find({
            where: { userId: req.user.id },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });

        const muscleGroupCounts: { [key: string]: number } = {};

        trainings.forEach((training: Training) => {
            training.trainingExercises.forEach((te: TrainingExercise) => {
                const muscleGroup = te.exercise.muscleGroup || 'Other';
                muscleGroupCounts[muscleGroup] = (muscleGroupCounts[muscleGroup] || 0) + 1;
            });
        });

        res.status(200).json(muscleGroupCounts);
    } catch (error) {
        res.status(500).json({ message: 'Error getting muscle group distribution', error });
    }
};

export const getExerciseProgressData = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const { exercise } = req.params;
        const trainings = await trainingRepository.find({
            where: { userId: req.user.id },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });

        const progressData = trainings
            .filter((training: Training) => 
                training.trainingExercises.some((te: TrainingExercise) => 
                    te.exercise.name === exercise
                )
            )
            .map((training: Training) => {
                const exerciseData = training.trainingExercises.find((te: TrainingExercise) => 
                    te.exercise.name === exercise
                );
                const date = training.date instanceof Date 
                    ? training.date.toISOString().split('T')[0]
                    : new Date(training.date).toISOString().split('T')[0];
                
                return {
                    date,
                    weight: Number(exerciseData?.weight || 0)
                };
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        res.status(200).json(progressData);
    } catch (error) {
        console.error('Error getting exercise progress data:', error);
        res.status(500).json({ message: 'Error getting exercise progress data', error });
    }
};

export const getTotalWeightPerSession = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const trainings = await trainingRepository.find({
            where: { userId: req.user.id },
            relations: ['trainingExercises']
        });

        const totalWeightData = trainings.map((training: Training) => {
            const totalWeight = training.trainingExercises.reduce((sum, te) => sum + te.weight, 0);
            const date = training.date instanceof Date 
                ? training.date.toISOString().split('T')[0]
                : new Date(training.date).toISOString().split('T')[0];
            
            return {
                date,
                totalWeight: Number(totalWeight)
            };
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        res.status(200).json(totalWeightData);
    } catch (error) {
        console.error('Error getting total weight per session:', error);
        res.status(500).json({ message: 'Error getting total weight per session', error });
    }
};

export const getUniqueExercises = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const trainings = await trainingRepository.find({
            where: { userId: req.user.id },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });

        const uniqueExercises = new Set<string>();
        trainings.forEach((training: Training) => {
            training.trainingExercises.forEach((te: TrainingExercise) => {
                uniqueExercises.add(te.exercise.name);
            });
        });

        res.status(200).json(Array.from(uniqueExercises));
    } catch (error) {
        res.status(500).json({ message: 'Error getting unique exercises', error });
    }
};