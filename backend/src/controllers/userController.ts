import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AppDataSource } from '../config/database';
import { ActivityLog, ActionType } from '../entities/ActivityLog';

// Get user metrics
export const getUserMetrics = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const metrics = await UserService.getUserMetrics(req.user.id);
        res.status(200).json(metrics);
    } catch (error) {
        console.error('[USER_CONTROLLER] Error fetching user metrics:', error);
        // Fallback is handled in Service, but if something else fails:
        res.status(500).json({ message: 'Error fetching user metrics' });
    }
};

export const updateUserMetrics = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const updatedUser = await UserService.updateUserMetrics(req.user.id, req.body);

        res.status(200).json({
            message: 'User metrics updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user metrics:', error);
        if (error instanceof Error && error.message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(500).json({ message: 'Error updating user metrics' });
        }
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const user = await UserService.getUser(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        console.error('[USER_CONTROLLER] Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }

        const updatedProfile = await UserService.updateUserProfile(req.user.id, req.body);

        res.status(200).json({
            success: true,
            data: updatedProfile
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        if (error instanceof Error && error.message === 'User not found') {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Error updating user profile'
            });
        }
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const deletedUserEmail = await UserService.deleteUser(userId, req.user.id);

        // Log the action (keeping logging in controller or moving to service? 
        // Ideally service should handle logging too, but for now keeping it here or moving it.
        // The original code logged it. Let's move logging to service later or keep it here if service doesn't depend on ActivityLog.
        // Actually, let's keep logging here for now to minimize changes to ActivityLog dependencies in Service, 
        // OR move it to service. Service is better.
        // But I didn't add logging to UserService.deleteUser.
        // I'll add logging here using the repository directly as before, or update Service to log.
        // For simplicity and matching the plan, I'll keep logging here for now, but using the repository.

        const activityLogRepository = AppDataSource.getRepository(ActivityLog);
        await activityLogRepository.save({
            userId: req.user.id,
            action: ActionType.DELETE,
            entityType: 'User',
            entityId: userId,
            details: { deletedUser: deletedUserEmail },
            timestamp: new Date()
        });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        if (error instanceof Error) {
            if (error.message === 'Permission denied') {
                res.status(403).json({ message: 'You do not have permission to delete users' });
                return;
            }
            if (error.message === 'User not found') {
                res.status(404).json({ message: 'User not found' });
                return;
            }
        }
        res.status(500).json({ message: 'Error deleting user' });
    }
};