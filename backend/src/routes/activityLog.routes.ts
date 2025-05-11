import { Router } from 'express';
import { ActivityLogController } from '../controllers/ActivityLogController';
import { isAdmin } from '../middleware/auth';

const router = Router();

// Only admin users can access activity logs
router.get('/', isAdmin as any, ActivityLogController.getActivityLogs);

export default router; 