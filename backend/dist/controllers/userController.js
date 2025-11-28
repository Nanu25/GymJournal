"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserProfile = exports.getUser = exports.updateUserMetrics = exports.getUserMetrics = void 0;
const UserService_1 = require("../services/UserService");
const database_1 = require("../config/database");
const ActivityLog_1 = require("../entities/ActivityLog");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
exports.getUserMetrics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    const metrics = await UserService_1.UserService.getUserMetrics(req.user.id);
    res.status(200).json(metrics);
});
exports.updateUserMetrics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    try {
        const updatedUser = await UserService_1.UserService.updateUserMetrics(req.user.id, req.body);
        res.status(200).json({
            message: 'User metrics updated successfully',
            user: updatedUser
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === 'User not found') {
            throw new AppError_1.AppError('User not found', 404);
        }
        throw error;
    }
});
exports.getUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    const user = await UserService_1.UserService.getUser(req.user.id);
    res.status(200).json(user);
});
exports.updateUserProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    try {
        const updatedProfile = await UserService_1.UserService.updateUserProfile(req.user.id, req.body);
        res.status(200).json({
            success: true,
            data: updatedProfile
        });
    }
    catch (error) {
        if (error instanceof Error && error.message === 'User not found') {
            throw new AppError_1.AppError('User not found', 404);
        }
        throw error;
    }
});
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    var _a;
    const { userId } = req.params;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new AppError_1.AppError('User not authenticated', 401);
    }
    try {
        const deletedUserEmail = await UserService_1.UserService.deleteUser(userId, req.user.id);
        const activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
        await activityLogRepository.save({
            userId: req.user.id,
            action: ActivityLog_1.ActionType.DELETE,
            entityType: 'User',
            entityId: userId,
            details: { deletedUser: deletedUserEmail },
            timestamp: new Date()
        });
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Permission denied') {
                throw new AppError_1.AppError('You do not have permission to delete users', 403);
            }
            if (error.message === 'User not found') {
                throw new AppError_1.AppError('User not found', 404);
            }
        }
        throw error;
    }
});
//# sourceMappingURL=userController.js.map