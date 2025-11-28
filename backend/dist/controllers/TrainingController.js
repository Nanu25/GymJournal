"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrainingByDate = exports.deleteTraining = exports.createTraining = exports.getAllTrainings = void 0;
const TrainingService_1 = require("../services/TrainingService");
const getAllTrainings = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { searchTerm, sortField, sortDirection } = req.query;
        const page = parseInt(req.query.page || '1', 10);
        const limitParam = req.query.limit;
        const parsedLimit = limitParam !== undefined ? parseInt(limitParam, 10) : 5;
        const limit = Number.isFinite(parsedLimit) && parsedLimit >= 0 ? parsedLimit : 5;
        const options = {
            userId: req.user.id,
            searchTerm: searchTerm,
            sortField: sortField,
            sortDirection: sortDirection,
            page,
            limit
        };
        const result = await TrainingService_1.TrainingService.getAllTrainings(options);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error fetching trainings:', error);
        res.status(500).json({ message: 'Error fetching trainings' });
    }
};
exports.getAllTrainings = getAllTrainings;
const createTraining = async (req, res) => {
    var _a;
    try {
        const { date, exercises } = req.body;
        if (!date) {
            res.status(400).json({ message: 'Date is required' });
            return;
        }
        if (!exercises || Object.keys(exercises).length === 0) {
            res.status(400).json({ message: 'At least one exercise is required' });
            return;
        }
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const result = await TrainingService_1.TrainingService.createTraining(req.user.id, date, exercises);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating training:', error);
        if (error instanceof Error) {
            if (error.message === 'Training for this date already exists') {
                res.status(400).json({ message: error.message });
                return;
            }
            if (error.message === 'No valid exercises provided') {
                res.status(400).json({ message: error.message });
                return;
            }
            if (error.message === 'Database service unavailable') {
                res.status(503).json({ message: error.message });
                return;
            }
        }
        res.status(500).json({ message: 'Error creating training' });
    }
};
exports.createTraining = createTraining;
const deleteTraining = async (req, res) => {
    var _a;
    try {
        const { date } = req.params;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        await TrainingService_1.TrainingService.deleteTraining(req.user.id, date);
        res.status(200).json({ message: 'Training deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting training:', error);
        if (error instanceof Error && error.message === 'Training not found') {
            res.status(404).json({ message: 'Training not found' });
            return;
        }
        res.status(500).json({ message: 'Error deleting training' });
    }
};
exports.deleteTraining = deleteTraining;
const updateTrainingByDate = async (req, res) => {
    var _a;
    try {
        const { date } = req.params;
        const { exercises } = req.body;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const result = await TrainingService_1.TrainingService.updateTraining(req.user.id, date, exercises);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error updating training:', error);
        if (error instanceof Error) {
            if (error.message === 'Training not found') {
                res.status(404).json({ message: 'Training not found' });
                return;
            }
            if (error.message === 'No valid exercises provided') {
                res.status(400).json({ message: error.message });
                return;
            }
        }
        res.status(500).json({ message: 'Error updating training' });
    }
};
exports.updateTrainingByDate = updateTrainingByDate;
//# sourceMappingURL=TrainingController.js.map