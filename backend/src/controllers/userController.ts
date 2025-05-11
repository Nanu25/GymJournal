import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

// Get user metrics
export const getUserMetrics = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: req.user.id } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            weight: user.weight || 0,
            height: user.height || 0,
            gender: user.gender || '',
            age: user.age || 0,
            timesPerWeek: user.timesPerWeek || 0,
            timePerSession: user.timePerSession || 0,
            repRange: user.repRange || ''
        });
    } catch (error) {
        console.error('Error fetching user metrics:', error);
        res.status(500).json({ message: 'Error fetching user metrics' });
    }
};

export const updateUserMetrics = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: req.user.id } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Update user fields
        Object.assign(user, req.body);
        await userRepository.save(user);

        res.status(200).json({
            message: 'User metrics updated successfully',
            user: {
                name: user.name,
                email: user.email,
                weight: user.weight,
                height: user.height,
                gender: user.gender,
                age: user.age,
                timesPerWeek: user.timesPerWeek,
                timePerSession: user.timePerSession,
                repRange: user.repRange
            }
        });
    } catch (error) {
        console.error('Error updating user metrics:', error);
        res.status(500).json({ message: 'Error updating user metrics' });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: req.user.id } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            weight: user.weight,
            height: user.height,
            gender: user.gender,
            age: user.age,
            timesPerWeek: user.timesPerWeek,
            timePerSession: user.timePerSession,
            repRange: user.repRange
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};