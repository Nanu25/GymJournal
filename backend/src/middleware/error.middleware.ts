import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    let error = err;

    if (!(error instanceof AppError)) {
        const statusCode = (error as any).statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new AppError(message, statusCode);
    }

    const statusCode = (error as AppError).statusCode;
    const message = (error as AppError).message;

    console.error(`[ERROR] ${req.method} ${req.url} - ${statusCode} - ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
