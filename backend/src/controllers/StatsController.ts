import { Request, Response } from 'express';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';
import { AppDataSource } from '../config/database';
import { TrainingExercise } from '../entities/TrainingExercise';

const trainingRepository = AppDataSource.getRepository(Training);

export const getMuscleGroupDistribution = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('[CONTROLLER] getMuscleGroupDistribution called');

        if (!req.user?.id) {
            console.log('[CONTROLLER] getMuscleGroupDistribution: No user ID found');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        console.log('[CONTROLLER] getMuscleGroupDistribution: Starting query for user', req.user.id);
        console.time('[CONTROLLER] muscleGroupQuery');

        // Using more efficient query with joins and group by
        const result = await AppDataSource
            .createQueryBuilder()
            .select('e.muscleGroup', 'muscleGroup')
            .addSelect('COUNT(te.id)', 'count')
            .from(Training, 't')
            .innerJoin('t.trainingExercises', 'te')
            .innerJoin('te.exercise', 'e')
            .where('t.userId = :userId', { userId: req.user.id })
            .groupBy('e.muscleGroup')
            .getRawMany();

        console.timeEnd('[CONTROLLER] muscleGroupQuery');
        console.log('[CONTROLLER] getMuscleGroupDistribution: Query returned', result.length, 'groups');

        const muscleGroupCounts: { [key: string]: number } = {};
        result.forEach(item => {
            muscleGroupCounts[item.muscleGroup || 'Other'] = parseInt(item.count, 10);
        });

        console.log('[CONTROLLER] getMuscleGroupDistribution: Sending response');
        res.status(200).json(muscleGroupCounts);
    } catch (error) {
        console.error('[CONTROLLER] Error in getMuscleGroupDistribution:', error);
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
        console.log('[CONTROLLER] getTotalWeightPerSession called');

        if (!req.user?.id) {
            console.log('[CONTROLLER] getTotalWeightPerSession: No user ID found');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        console.log('[CONTROLLER] getTotalWeightPerSession: Starting query for user', req.user.id);
        console.time('[CONTROLLER] totalWeightQuery');

        // More efficient query with direct aggregation in the database
        const result = await AppDataSource
            .createQueryBuilder()
            .select('t.date', 'date')
            .addSelect('SUM(te.weight)', 'totalWeight')
            .from(Training, 't')
            .innerJoin('t.trainingExercises', 'te')
            .where('t.userId = :userId', { userId: req.user.id })
            .groupBy('t.date')
            .orderBy('t.date', 'ASC')
            .getRawMany();

        console.timeEnd('[CONTROLLER] totalWeightQuery');
        console.log('[CONTROLLER] getTotalWeightPerSession: Query returned', result.length, 'sessions');

        const totalWeightData = result.map(item => {
            const date = new Date(item.date).toISOString().split('T')[0];
            return {
                date,
                totalWeight: Number(item.totalWeight)
            };
        });

        console.log('[CONTROLLER] getTotalWeightPerSession: Sending response');
        res.status(200).json(totalWeightData);
    } catch (error) {
        console.error('[CONTROLLER] Error in getTotalWeightPerSession:', error);
        res.status(500).json({ message: 'Error getting total weight per session', error });
    }
};

export const getUniqueExercises = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('[CONTROLLER] getUniqueExercises called');

        if (!req.user?.id) {
            console.log('[CONTROLLER] getUniqueExercises: No user ID found');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        console.log('[CONTROLLER] getUniqueExercises: Starting query for user', req.user.id);
        console.time('[CONTROLLER] uniqueExercisesQuery');

        // More efficient query to get unique exercises directly from the database
        const result = await AppDataSource
            .createQueryBuilder()
            .select('DISTINCT e.name', 'name')
            .from(Exercise, 'e')
            .innerJoin('e.trainingExercises', 'te')
            .innerJoin('te.training', 't')
            .where('t.userId = :userId', { userId: req.user.id })
            .orderBy('e.name', 'ASC')
            .getRawMany();

        console.timeEnd('[CONTROLLER] uniqueExercisesQuery');
        console.log('[CONTROLLER] getUniqueExercises: Query returned', result.length, 'exercises');

        const uniqueExercises = result.map(item => item.name);

        console.log('[CONTROLLER] getUniqueExercises: Sending response');
        res.status(200).json(uniqueExercises);
    } catch (error) {
        console.error('[CONTROLLER] Error in getUniqueExercises:', error);
        res.status(500).json({ message: 'Error getting unique exercises', error });
    }
};
