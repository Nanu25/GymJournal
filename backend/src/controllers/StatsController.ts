import { Request, Response } from 'express';
import { StatsService } from '../services/StatsService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export const getMuscleGroupDistribution = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    const result = await StatsService.getMuscleGroupDistribution(req.user.id);
    res.status(200).json(result);
});

export const getExerciseProgressData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    const { exercise } = req.params;
    const result = await StatsService.getExerciseProgress(req.user.id, exercise);
    res.status(200).json(result);
});

export const getTotalWeightPerSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    const result = await StatsService.getTotalWeightPerSession(req.user.id);
    res.status(200).json(result);
});

export const getUniqueExercises = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    const result = await StatsService.getUniqueExercises(req.user.id);
    res.status(200).json(result);
});

export const getTrainingDates = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    const result = await StatsService.getTrainingDates(req.user.id);
    res.status(200).json(result);
});
