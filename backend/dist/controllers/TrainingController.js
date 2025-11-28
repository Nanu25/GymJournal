"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrainingByDate = exports.deleteTraining = exports.createTraining = exports.getAllTrainings = void 0;
const TrainingService_1 = require("../services/TrainingService");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
exports.getAllTrainings = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
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
});
exports.createTraining = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const { date, exercises } = req.body;
    if (!date) {
        throw new AppError_1.AppError('Date is required', 400);
    }
    if (!exercises || Object.keys(exercises).length === 0) {
        throw new AppError_1.AppError('At least one exercise is required', 400);
    }
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    const result = await TrainingService_1.TrainingService.createTraining(req.user.id, date, exercises);
    res.status(201).json(result);
});
exports.deleteTraining = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const { date } = req.params;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    await TrainingService_1.TrainingService.deleteTraining(req.user.id, date);
    res.status(200).json({ message: 'Training deleted successfully' });
});
exports.updateTrainingByDate = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const { date } = req.params;
    const { exercises } = req.body;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    const result = await TrainingService_1.TrainingService.updateTraining(req.user.id, date, exercises);
    res.status(200).json(result);
});
//# sourceMappingURL=TrainingController.js.map