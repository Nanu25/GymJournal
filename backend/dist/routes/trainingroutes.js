"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TrainingController_1 = require("../controllers/TrainingController");
const router = express_1.default.Router();
// GET /api/trainings - Get all trainings
router.get('/', TrainingController_1.getAllTrainings);
// POST /api/trainings - Create a new training
router.post('/', TrainingController_1.createTraining);
router.delete('/:date', TrainingController_1.deleteTraining);
// PUT /api/trainings/:id - Update a training by ID
router.put('/:date', TrainingController_1.updateTrainingByDate);
router.get('/muscle-group-distribution', TrainingController_1.getMuscleGroupDistribution);
router.get('/exercise-progress/:exercise', TrainingController_1.getExerciseProgressData);
// GET /api/trainings/total-weight - Get total weight per session for bar chart
router.get('/total-weight', TrainingController_1.getTotalWeightPerSession);
// GET /api/trainings/exercises - Get unique exercises list
router.get('/exercises', TrainingController_1.getUniqueExercises);
exports.default = router;
