"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const TrainingController_1 = require("../controllers/TrainingController");
const router = (0, express_1.Router)();
router.use('/', auth_1.authenticateToken);
router.get('/', TrainingController_1.getAllTrainings);
router.post('/', TrainingController_1.createTraining);
router.delete('/:date', TrainingController_1.deleteTraining);
router.put('/:date', TrainingController_1.updateTrainingByDate);
router.get('/muscle-group-distribution', TrainingController_1.getMuscleGroupDistribution);
router.get('/exercise-progress/:exercise', TrainingController_1.getExerciseProgressData);
router.get('/total-weight', TrainingController_1.getTotalWeightPerSession);
router.get('/exercises', TrainingController_1.getUniqueExercises);
exports.default = router;
//# sourceMappingURL=trainingroutes.js.map