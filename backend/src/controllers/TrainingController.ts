import { Request, Response } from 'express';
import { TrainingService } from '../services/TrainingService';
import { TrainingFilterOptions } from '../repositories/TrainingRepository';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

export const getAllTrainings = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
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
    } catch (error) {
        console.error('Error fetching trainings:', error);
        res.status(500).json({ message: 'Error fetching trainings' });
    }
};

export const createTraining = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date, exercises } = req.body;

        if (!date) {
            res.status(400).json({ message: 'Date is required' });
            return;
        }

        if (!exercises || Object.keys(exercises).length === 0) {
            res.status(400).json({ message: 'At least one exercise is required' });
            return;
        }

        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const result = await TrainingService.createTraining(req.user.id, date, exercises);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating training:', error);
        if (error instanceof Error) {
            if (error.message === 'Training for this date already exists') {
                res.status(400).json({ message: error.message });
                return;
            }
            if (error.message === 'No valid exercises provided') {
                res.status(400).json({ message: error.message });
                return;
            }
            if (error.message === 'Database service unavailable') {
                res.status(503).json({ message: error.message });
                return;
            }
        }
        res.status(500).json({ message: 'Error creating training' });
    }
};

export const deleteTraining = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date } = req.params;

        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        await TrainingService.deleteTraining(req.user.id, date);
        res.status(200).json({ message: 'Training deleted successfully' });
    } catch (error) {
        console.error('Error deleting training:', error);
        if (error instanceof Error && error.message === 'Training not found') {
            res.status(404).json({ message: 'Training not found' });
            return;
        }
        res.status(500).json({ message: 'Error deleting training' });
    }
};

export const updateTrainingByDate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date } = req.params;
        const { exercises } = req.body;

        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const result = await TrainingService.updateTraining(req.user.id, date, exercises);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating training:', error);
        if (error instanceof Error) {
            if (error.message === 'Training not found') {
                res.status(404).json({ message: 'Training not found' });
                return;
            }
            if (error.message === 'No valid exercises provided') {
                res.status(400).json({ message: error.message });
                return;
            }
        }
        res.status(500).json({ message: 'Error updating training' });
    }
};