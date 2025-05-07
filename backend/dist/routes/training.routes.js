"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const training_controller_1 = require("../controllers/training.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply authentication middleware to all training routes
router.use(auth_middleware_1.authenticateToken);
// Create a new training
router.post('/', async (req, res) => {
    await training_controller_1.TrainingController.createTraining(req, res);
});
// Get all trainings for the authenticated user
router.get('/', async (req, res) => {
    await training_controller_1.TrainingController.getTrainings(req, res);
});
// Get a specific training by ID
router.get('/:id', async (req, res) => {
    await training_controller_1.TrainingController.getTrainingById(req, res);
});
exports.default = router;
