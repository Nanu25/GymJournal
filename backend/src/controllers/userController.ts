import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/database';
import { ActivityLog, ActionType } from '../entities/ActivityLog';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

// Get user metrics
export const getUserMetrics = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    const metrics = await UserService.getUserMetrics(req.user.id);
    res.status(200).json(metrics);
});

export const updateUserMetrics = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    try {
        const updatedUser = await UserService.updateUserMetrics(req.user.id, req.body);

        res.status(200).json({
            message: 'User metrics updated successfully',
            user: updatedUser
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'User not found') {
            throw new AppError('User not found', 404);
        }
        throw error;
    }
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    const user = await UserService.getUser(req.user.id);
    res.status(200).json(user);
});

export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    try {
        const updatedProfile = await UserService.updateUserProfile(req.user.id, req.body);

        res.status(200).json({
            success: true,
            data: updatedProfile
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'User not found') {
            throw new AppError('User not found', 404);
        }
        throw error;
    }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId as string;

    if (!req.user?.id) {
        throw new AppError('User not authenticated', 401);
    }

    try {
        const deletedUserEmail = await UserService.deleteUser(userId, req.user.id);

        const activityLogRepository = AppDataSource.getRepository(ActivityLog);
        await activityLogRepository.save({
            userId: String(req.user.id),
            action: ActionType.DELETE,
            entityType: 'User',
            entityId: userId,
            details: { deletedUser: deletedUserEmail },
            timestamp: new Date()
        });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Permission denied') {
                throw new AppError('You do not have permission to delete users', 403);
            }
            if (error.message === 'User not found') {
                throw new AppError('User not found', 404);
            }
        }
        throw error;
    }
});