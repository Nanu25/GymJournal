import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { AppDataSource } from '../config/database';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user || !user.isAdmin) {
            res.status(403).json({ message: 'Forbidden: Admin access required' });
            return;
        }

        next();
    } catch (error) {
        console.error('Error in admin middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 