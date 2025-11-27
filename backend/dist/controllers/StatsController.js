"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingDates = exports.getUniqueExercises = exports.getTotalWeightPerSession = exports.getExerciseProgressData = exports.getMuscleGroupDistribution = void 0;
const StatsService_1 = require("../services/StatsService");
const getMuscleGroupDistribution = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const result = await StatsService_1.StatsService.getMuscleGroupDistribution(req.user.id);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('[CONTROLLER] Error in getMuscleGroupDistribution:', error);
        res.status(500).json({ message: 'Error getting muscle group distribution', error });
    }
};
exports.getMuscleGroupDistribution = getMuscleGroupDistribution;
const getExerciseProgressData = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { exercise } = req.params;
        const result = await StatsService_1.StatsService.getExerciseProgress(req.user.id, exercise);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error getting exercise progress data:', error);
        res.status(500).json({ message: 'Error getting exercise progress data', error });
    }
};
exports.getExerciseProgressData = getExerciseProgressData;
const getTotalWeightPerSession = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const result = await StatsService_1.StatsService.getTotalWeightPerSession(req.user.id);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('[CONTROLLER] Error in getTotalWeightPerSession:', error);
        res.status(500).json({ message: 'Error getting total weight per session', error });
    }
};
exports.getTotalWeightPerSession = getTotalWeightPerSession;
const getUniqueExercises = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const result = await StatsService_1.StatsService.getUniqueExercises(req.user.id);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('[CONTROLLER] Error in getUniqueExercises:', error);
        res.status(500).json({ message: 'Error getting unique exercises', error });
    }
};
exports.getUniqueExercises = getUniqueExercises;
const getTrainingDates = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const result = await StatsService_1.StatsService.getTrainingDates(req.user.id);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('[CONTROLLER] Error in getTrainingDates:', error);
        res.status(500).json({ message: 'Error getting training dates', error });
    }
};
exports.getTrainingDates = getTrainingDates;
//# sourceMappingURL=StatsController.js.map