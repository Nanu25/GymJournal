"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const TrainingController_1 = require("../controllers/TrainingController");
const router = (0, express_1.Router)();
// Protected routes - require authentication
router.use('/', auth_1.authenticateToken);
// GET /api/trainings - Get all trainings
router.get('/', TrainingController_1.getAllTrainings);
// POST /api/trainings - Create a new training
router.post('/', TrainingController_1.createTraining);
// DELETE /api/trainings/:date - Delete a training
router.delete('/:date', TrainingController_1.deleteTraining);
// PUT /api/trainings/:date - Update a training by date
router.put('/:date', TrainingController_1.updateTrainingByDate);
// Analytics routes
router.get('/muscle-group-distribution', TrainingController_1.getMuscleGroupDistribution);
router.get('/exercise-progress/:exercise', TrainingController_1.getExerciseProgressData);
router.get('/total-weight', TrainingController_1.getTotalWeightPerSession);
router.get('/exercises', TrainingController_1.getUniqueExercises);
exports.default = router;
