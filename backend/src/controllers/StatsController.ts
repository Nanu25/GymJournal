import { Request, Response } from 'express';
import { StatsService } from '../services/StatsService';

export const getMuscleGroupDistribution = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const result = await StatsService.getMuscleGroupDistribution(req.user.id);
        res.status(200).json(result);
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
        const result = await StatsService.getExerciseProgress(req.user.id, exercise);
        res.status(200).json(result);
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

        const result = await StatsService.getTotalWeightPerSession(req.user.id);
        res.status(200).json(result);
    } catch (error) {
        console.error('[CONTROLLER] Error in getTotalWeightPerSession:', error);
        res.status(500).json({ message: 'Error getting total weight per session', error });
    }
};

export const getUniqueExercises = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const result = await StatsService.getUniqueExercises(req.user.id);
        res.status(200).json(result);
    } catch (error) {
        console.error('[CONTROLLER] Error in getUniqueExercises:', error);
        res.status(500).json({ message: 'Error getting unique exercises', error });
    }
};

export const getTrainingDates = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const result = await StatsService.getTrainingDates(req.user.id);
        res.status(200).json(result);
    } catch (error) {
        console.error('[CONTROLLER] Error in getTrainingDates:', error);
        res.status(500).json({ message: 'Error getting training dates', error });
    }
};
