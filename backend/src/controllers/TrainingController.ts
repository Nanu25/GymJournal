import { Request, Response } from 'express';
import { TrainingService } from '../services/TrainingService';
import { TrainingFilterOptions } from '../repositories/TrainingRepository';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

export const getAllTrainings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    const { searchTerm, sortField, sortDirection } = req.query;
    const page = parseInt((req.query.page as string) || '1', 10);
    const limitParam = req.query.limit as string | undefined;
    const parsedLimit = limitParam !== undefined ? parseInt(limitParam, 10) : 5;
    const limit = Number.isFinite(parsedLimit) && parsedLimit >= 0 ? parsedLimit : 5;

    const options: TrainingFilterOptions = {
        userId: req.user.id,
        searchTerm: searchTerm as string,
        sortField: sortField as string,
        sortDirection: sortDirection as 'asc' | 'desc',
        page,
        limit
    };

    const result = await TrainingService.getAllTrainings(options);
    res.status(200).json(result);
});

export const createTraining = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { date, exercises } = req.body;

    if (!date) {
        throw new AppError('Date is required', 400);
    }

    if (!exercises || Object.keys(exercises).length === 0) {
        throw new AppError('At least one exercise is required', 400);
    }

    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    const result = await TrainingService.createTraining(req.user.id, date, exercises);
    res.status(201).json(result);
});

export const deleteTraining = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const date = req.params.date as string;

    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    await TrainingService.deleteTraining(req.user.id, date);
    res.status(200).json({ message: 'Training deleted successfully' });
});

export const updateTrainingByDate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const date = req.params.date as string;
    const { exercises, date: newDate } = req.body;

    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    const result = await TrainingService.updateTraining(req.user.id, date, exercises, newDate);
    res.status(200).json(result);
});