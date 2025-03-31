import express from 'express';
import { getUserMetrics, updateUserMetrics } from '../controllers/userController';

const router = express.Router();

// GET /api/user - Retrieve user metrics
router.get('/', getUserMetrics);

// PUT /api/user - Update user metrics
router.put('/', updateUserMetrics);

export default router;