import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { MonitoredUser } from '../entities/MonitoredUser';
import { authenticateToken } from '../middleware/auth';
import { User } from '../entities/User';

const router = Router();
const monitoredUserRepository = AppDataSource.getRepository(MonitoredUser);
const userRepository = AppDataSource.getRepository(User);

// Middleware to check admin
function requireAdmin(req: Request, res: Response, next: Function) {
    userRepository.findOne({ where: { id: req.user!.id } }).then(user => {
        if (!user || !user.isAdmin) {
            res.status(403).json({ message: 'Admin privileges required' });
            return;
        }
        next();
    }).catch(() => {
        res.status(500).json({ message: 'Error checking admin status' });
    });
}

// GET /api/monitored-users - Admin only
router.get('/', authenticateToken, requireAdmin, async (_req: Request, res: Response) => {
    const monitoredUsers = await monitoredUserRepository.find();
    res.json(monitoredUsers);
});

// DELETE /api/monitored-users/:id - Admin only
router.delete('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const monitoredUser = await monitoredUserRepository.findOne({ where: { id } });
        if (!monitoredUser) {
            res.status(404).json({ message: 'Monitored user not found' });
            return;
        }
        await monitoredUserRepository.remove(monitoredUser);
        res.status(200).json({ message: 'Monitored user deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting monitored user', error });
    }
});

export default router; 