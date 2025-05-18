import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { ActivityLog, ActionType } from '../entities/ActivityLog';

// Get user metrics
export const getUserMetrics = async (req: Request, res: Response) => {
    console.log('[USER_CONTROLLER] getUserMetrics called');
    
    // ******************************************
    // TESTING MODE: Return mock data for testing frontend
    // Comment out the following lines in production
    // ******************************************
    console.log('[USER_CONTROLLER] TEST MODE: Returning mock data instead of querying DB');
    const mockUserData = {
        name: "Works",
        email: "test@example.com",
        weight: 75,
        height: 180,
        gender: 'Male',
        age: 30,
        timesPerWeek: 3,
        timePerSession: 60,
        repRange: '8-12',
        isAdmin: false
    };
    
    res.status(200).json(mockUserData);
    return;
    // ******************************************
    // END TESTING MODE
    // ******************************************
    
    try {
        if (!req.user?.id) {
            console.log('[USER_CONTROLLER] No user ID found in request');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        
        console.log('[USER_CONTROLLER] Fetching user with ID:', req.user.id);
        console.time('[USER_CONTROLLER] userQuery');
        
        try {
            const userRepository = AppDataSource.getRepository(User);
            
            // First check if database connection is active
            if (!AppDataSource.isInitialized) {
                console.error('[USER_CONTROLLER] ERROR: Database connection not initialized');
                throw new Error('Database connection not initialized');
            }
            
            console.log('[USER_CONTROLLER] Database connection is active, querying user');
            const user = await userRepository.findOne({ where: { id: req.user.id } });
            
            console.timeEnd('[USER_CONTROLLER] userQuery');
            
            if (!user) {
                console.log('[USER_CONTROLLER] User not found for ID:', req.user.id);
                res.status(404).json({ message: 'User not found' });
                return;
            }
            
            console.log('[USER_CONTROLLER] User found, name value:', user.name);
            
            // Create response object with default values for null/undefined fields
            const responseData = {
                name: user.name,
                email: user.email,
                weight: user.weight ?? 0, // Use nullish coalescing to handle null/undefined
                height: user.height ?? 0,
                gender: user.gender ?? '',
                age: user.age ?? 0,
                timesPerWeek: user.timesPerWeek ?? 0,
                timePerSession: user.timePerSession ?? 0,
                repRange: user.repRange ?? '',
                isAdmin: user.isAdmin ?? false
            };
            
            console.log('[USER_CONTROLLER] Sending response:', responseData);
            res.status(200).json(responseData);
        } catch (dbError) {
            console.error('[USER_CONTROLLER] Database query error:', dbError);
            throw dbError; // Re-throw to be caught by the outer try-catch
        }
    } catch (error) {
        console.error('[USER_CONTROLLER] Error fetching user metrics:', error);
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
    console.log('[USER_CONTROLLER] getUser called');
    
    // ******************************************
    // TESTING MODE: Return mock data for testing frontend
    // Comment out the following lines in production
    // ******************************************
    console.log('[USER_CONTROLLER] TEST MODE: Returning mock data instead of querying DB');
    const mockUserData = {
        name: "Works",
        email: "test@example.com",
        weight: 75,
        height: 180,
        gender: 'Male',
        age: 30,
        timesPerWeek: 3,
        timePerSession: 60,
        repRange: '8-12',
        isAdmin: false
    };
    
    res.status(200).json(mockUserData);
    return;
    // ******************************************
    // END TESTING MODE
    // ******************************************
    
    try {
        if (!req.user?.id) {
            console.log('[USER_CONTROLLER] No user ID found in request');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        console.log('[USER_CONTROLLER] Fetching user with ID:', req.user.id);
        console.time('[USER_CONTROLLER] userQuery');
        
        try {
            const userRepository = AppDataSource.getRepository(User);
            
            // First check if database connection is active
            if (!AppDataSource.isInitialized) {
                console.error('[USER_CONTROLLER] ERROR: Database connection not initialized');
                throw new Error('Database connection not initialized');
            }
            
            console.log('[USER_CONTROLLER] Database connection is active, querying user');
            const user = await userRepository.findOne({ where: { id: req.user.id } });
            
            console.timeEnd('[USER_CONTROLLER] userQuery');
            
            if (!user) {
                console.log('[USER_CONTROLLER] User not found for ID:', req.user.id);
                res.status(404).json({ message: 'User not found' });
                return;
            }
            
            console.log('[USER_CONTROLLER] User found, name value:', user.name);
            
            // Create response object with default values for null/undefined fields
            const responseData = {
                name: user.name,
                email: user.email,
                weight: user.weight ?? 0,
                height: user.height ?? 0,
                gender: user.gender ?? '',
                age: user.age ?? 0,
                timesPerWeek: user.timesPerWeek ?? 0,
                timePerSession: user.timePerSession ?? 0,
                repRange: user.repRange ?? '',
                isAdmin: user.isAdmin ?? false
            };
            
            console.log('[USER_CONTROLLER] Sending response:', responseData);
            res.status(200).json(responseData);
        } catch (dbError) {
            console.error('[USER_CONTROLLER] Database query error:', dbError);
            throw dbError; // Re-throw to be caught by the outer try-catch
        }
    } catch (error) {
        console.error('[USER_CONTROLLER] Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // Check if the user making the request is an admin
        if (!req.user?.id) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        
        const requestingUserRepository = AppDataSource.getRepository(User);
        const requestingUser = await requestingUserRepository.findOne({ where: { id: req.user.id } });

        if (!requestingUser || !requestingUser.isAdmin) {
            res.status(403).json({ message: 'You do not have permission to delete users' });
            return;
        }

        // Find the user to delete
        const userRepository = AppDataSource.getRepository(User);
        const userToDelete = await userRepository.findOne({ where: { id: userId } });

        if (!userToDelete) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Log the action
        const activityLogRepository = AppDataSource.getRepository(ActivityLog);
        await activityLogRepository.save({
            userId: req.user.id,
            action: ActionType.DELETE,
            entityType: 'User',
            entityId: userId,
            details: { deletedUser: userToDelete.email },
            timestamp: new Date()
        });

        // Delete the user
        await userRepository.remove(userToDelete);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};