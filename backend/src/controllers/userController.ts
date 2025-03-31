import { Request, Response } from 'express';

// In-memory storage for user metrics (assuming a single user for simplicity)
let userMetrics = { weight: 0 }; // Default weight is 0

// Get user metrics
export const getUserMetrics = (req: Request, res: Response) => {
    res.status(200).json(userMetrics);
};
export const updateUserMetrics = (req: Request, res: Response): void => {
    const { weight } = req.body;

    if (weight === undefined) {
        res.status(400).json({ message: 'Weight is required' });
        return;
    }

    if (typeof weight !== 'number' || weight <= 0) {
        res.status(400).json({ message: 'Weight must be a positive number' });
        return;
    }

    // Update the in-memory storage
    userMetrics.weight = weight;

    res.status(200).json({ message: 'Weight updated successfully', weight });
};