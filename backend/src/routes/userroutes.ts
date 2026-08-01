import express from 'express';
import { getUserMetrics, updateUserMetrics, deleteUser, updateUserProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/user - Retrieve user metrics
router.get('/', getUserMetrics);

// PUT /api/user - Update user metrics
router.put('/', updateUserMetrics);

// PUT /api/user/profile - Update user profile (for Google users)
router.put('/profile', updateUserProfile);

// DELETE /api/users/:userId - Delete a user (admin only)
router.delete('/:userId', authenticateToken, deleteUser);

export default router;