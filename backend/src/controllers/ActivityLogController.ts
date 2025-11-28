import { Request, Response } from 'express';
import { LoggingService } from '../services/LoggingService';

export class ActivityLogController {
    static async getActivityLogs(req: Request, res: Response) {
        try {
            const { userId, entityType, startDate, endDate } = req.query;

            // Convert userId to string or undefined based on its presence
            let userIdValue: string | undefined = undefined;
            if (userId !== undefined && userId !== '') {
                userIdValue = userId as string;
            }

            const logs = await LoggingService.getActivityLogs(
                userIdValue,
                entityType as string,
                startDate ? new Date(startDate as string) : undefined,
                endDate ? new Date(endDate as string) : undefined
            );

            res.json(logs);
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            res.status(500).json({ message: 'Error fetching activity logs' });
        }
    }
} 