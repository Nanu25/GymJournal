"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const TrainingController_1 = require("../controllers/TrainingController");
const StatsController_1 = require("../controllers/StatsController");
const router = (0, express_1.Router)();
router.use('/', auth_1.authenticateToken);
router.get('/', TrainingController_1.getAllTrainings);
router.post('/', TrainingController_1.createTraining);
router.delete('/:date', TrainingController_1.deleteTraining);
router.put('/:date', TrainingController_1.updateTrainingByDate);
router.get('/muscle-group-distribution', StatsController_1.getMuscleGroupDistribution);
router.get('/exercise-progress/:exercise', StatsController_1.getExerciseProgressData);
router.get('/total-weight', StatsController_1.getTotalWeightPerSession);
router.get('/exercises', StatsController_1.getUniqueExercises);
exports.default = router;
//# sourceMappingURL=trainingroutes.js.map