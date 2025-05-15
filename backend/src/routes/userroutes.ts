import express from 'express';
import { getUserMetrics, updateUserMetrics, deleteUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/user - Retrieve user metrics
router.get('/', getUserMetrics);

// PUT /api/user - Update user metrics
router.put('/', updateUserMetrics);

// DELETE /api/users/:userId - Delete a user (admin only)
router.delete('/:userId', authenticateToken, deleteUser);

export default router;