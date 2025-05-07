import { Router, RequestHandler } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getAllTrainings,
    createTraining,
    updateTrainingByDate,
    deleteTraining,
    getMuscleGroupDistribution,
    getExerciseProgressData,
    getUniqueExercises,
    getTotalWeightPerSession
} from "../controllers/TrainingController";

const router = Router();

// Protected routes - require authentication
router.use('/', authenticateToken as RequestHandler);

// GET /api/trainings - Get all trainings
router.get('/', getAllTrainings as RequestHandler);

// POST /api/trainings - Create a new training
router.post('/', createTraining as RequestHandler);

// DELETE /api/trainings/:date - Delete a training
router.delete('/:date', deleteTraining as RequestHandler);

// PUT /api/trainings/:date - Update a training by date
router.put('/:date', updateTrainingByDate as RequestHandler);

// Analytics routes
router.get('/muscle-group-distribution', getMuscleGroupDistribution as RequestHandler);
router.get('/exercise-progress/:exercise', getExerciseProgressData as RequestHandler);
router.get('/total-weight', getTotalWeightPerSession as RequestHandler);
router.get('/exercises', getUniqueExercises as RequestHandler);

export default router;