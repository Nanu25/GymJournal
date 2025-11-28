import { Request, Response } from 'express';
import { LoggingService } from '../services/LoggingService';
import { asyncHandler } from '../utils/asyncHandler';

export class ActivityLogController {
    static getActivityLogs = asyncHandler(async (req: Request, res: Response) => {
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
    });
}