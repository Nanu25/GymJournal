import { Request, Response, NextFunction } from 'express';
import { ActionType } from '../entities/ActivityLog';
import { LoggingService } from '../services/LoggingService';

export class ActivityLoggerMiddleware {
    static logActivity(actionType: ActionType) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const originalSend = res.send;
            const originalJson = res.json;

            // Override res.send
            res.send = function(body: any): Response {
                res.locals.responseBody = body;
                return originalSend.call(this, body);
            };

            // Override res.json
            res.json = function(body: any): Response {
                res.locals.responseBody = body;
                return originalJson.call(this, body);
            };

            // Add listener for when response is finished
            res.on('finish', async () => {
                try {
                    const userId = (req as any).user?.id;
                    if (!userId) {
                        console.error('No user ID found in request');
                        return;
                    }

                    const entityId = req.params.id || req.params.date || undefined;
                    const details = {
                        method: req.method,
                        path: req.path,
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        response: res.locals.responseBody,
                        statusCode: res.statusCode
                    };

                    await LoggingService.logActivity(
                        userId,
                        actionType,
                        req.path.split('/')[2] || 'unknown',
                        entityId,
                        details
                    );
                } catch (error) {
                    console.error('Error logging activity:', error);
                }
            });

            next();
        };
    }
} 