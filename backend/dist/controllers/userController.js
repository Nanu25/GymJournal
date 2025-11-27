"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUserProfile = exports.getUser = exports.updateUserMetrics = exports.getUserMetrics = void 0;
const UserService_1 = require("../services/UserService");
const database_1 = require("../config/database");
const ActivityLog_1 = require("../entities/ActivityLog");
const getUserMetrics = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const metrics = await UserService_1.UserService.getUserMetrics(req.user.id);
        res.status(200).json(metrics);
    }
    catch (error) {
        console.error('[USER_CONTROLLER] Error fetching user metrics:', error);
        res.status(500).json({ message: 'Error fetching user metrics' });
    }
};
exports.getUserMetrics = getUserMetrics;
const updateUserMetrics = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const updatedUser = await UserService_1.UserService.updateUserMetrics(req.user.id, req.body);
        res.status(200).json({
            message: 'User metrics updated successfully',
            user: updatedUser
        });
    }
    catch (error) {
        console.error('Error updating user metrics:', error);
        if (error instanceof Error && error.message === 'User not found') {
            res.status(404).json({ message: 'User not found' });
        }
        else {
            res.status(500).json({ message: 'Error updating user metrics' });
        }
    }
};
exports.updateUserMetrics = updateUserMetrics;
const getUser = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const user = await UserService_1.UserService.getUser(req.user.id);
        res.status(200).json(user);
    }
    catch (error) {
        console.error('[USER_CONTROLLER] Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};
exports.getUser = getUser;
const updateUserProfile = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }
        const updatedProfile = await UserService_1.UserService.updateUserProfile(req.user.id, req.body);
        res.status(200).json({
            success: true,
            data: updatedProfile
        });
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        if (error instanceof Error && error.message === 'User not found') {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: 'Error updating user profile'
            });
        }
    }
};
exports.updateUserProfile = updateUserProfile;
const deleteUser = async (req, res) => {
    var _a;
    try {
        const { userId } = req.params;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
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
        console.error('Error deleting user:', error);
        if (error instanceof Error) {
            if (error.message === 'Permission denied') {
                res.status(403).json({ message: 'You do not have permission to delete users' });
                return;
            }
            if (error.message === 'User not found') {
                res.status(404).json({ message: 'User not found' });
                return;
            }
        }
        res.status(500).json({ message: 'Error deleting user' });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map