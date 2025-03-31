import express from 'express';
import {getAllTrainings, createTraining, updateTrainingByDate, deleteTraining, getMuscleGroupDistribution, getExerciseProgressData, getUniqueExercises, getTotalWeightPerSession} from "../controllers/TrainingController";

const router = express.Router();

// GET /api/trainings - Get all trainings
router.get('/', getAllTrainings);

// POST /api/trainings - Create a new training
router.post('/', createTraining);

router.delete('/:date', deleteTraining);

// PUT /api/trainings/:id - Update a training by ID
router.put('/:date', updateTrainingByDate);

router.get('/muscle-group-distribution', getMuscleGroupDistribution);

router.get('/exercise-progress/:exercise', getExerciseProgressData);

// GET /api/trainings/total-weight - Get total weight per session for bar chart
router.get('/total-weight', getTotalWeightPerSession);

// GET /api/trainings/exercises - Get unique exercises list
router.get('/exercises', getUniqueExercises);

export default router;