"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingController = void 0;
const training_service_1 = require("../services/training.service");
class TrainingController {
}
exports.TrainingController = TrainingController;
TrainingController.createTraining = (req, res, next) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    const { date, exercises } = req.body;
    training_service_1.TrainingService.createTraining(userId, new Date(date), exercises)
        .then(training => {
        res.status(201).json(training);
    })
        .catch(next);
};
TrainingController.getTrainings = (req, res, next) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    training_service_1.TrainingService.getTrainings(userId)
        .then(trainings => {
        res.json(trainings);
    })
        .catch(next);
};
TrainingController.getTrainingById = (req, res, next) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }
    const trainingId = req.params.id;
    training_service_1.TrainingService.getTrainingById(userId, trainingId)
        .then(training => {
        if (!training) {
            res.status(404).json({ error: 'Training not found' });
            return;
        }
        res.json(training);
    })
        .catch(next);
};
