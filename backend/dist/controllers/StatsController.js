"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainingDates = exports.getUniqueExercises = exports.getTotalWeightPerSession = exports.getExerciseProgressData = exports.getMuscleGroupDistribution = void 0;
const StatsService_1 = require("../services/StatsService");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
exports.getMuscleGroupDistribution = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    const result = await StatsService_1.StatsService.getMuscleGroupDistribution(req.user.id);
    res.status(200).json(result);
});
exports.getExerciseProgressData = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    const { exercise } = req.params;
    const result = await StatsService_1.StatsService.getExerciseProgress(req.user.id, exercise);
    res.status(200).json(result);
});
exports.getTotalWeightPerSession = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    const result = await StatsService_1.StatsService.getTotalWeightPerSession(req.user.id);
    res.status(200).json(result);
});
exports.getUniqueExercises = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    const result = await StatsService_1.StatsService.getUniqueExercises(req.user.id);
    res.status(200).json(result);
});
exports.getTrainingDates = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    const result = await StatsService_1.StatsService.getTrainingDates(req.user.id);
    res.status(200).json(result);
});
//# sourceMappingURL=StatsController.js.map