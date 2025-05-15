"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUser = exports.updateUserMetrics = exports.getUserMetrics = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const ActivityLog_1 = require("../entities/ActivityLog");
const getUserMetrics = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
            weight: user.weight || 0,
            height: user.height || 0,
            gender: user.gender || '',
            age: user.age || 0,
            timesPerWeek: user.timesPerWeek || 0,
            timePerSession: user.timePerSession || 0,
            repRange: user.repRange || '',
            isAdmin: user.isAdmin || false
        });
    }
    catch (error) {
        console.error('Error fetching user metrics:', error);
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
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        Object.assign(user, req.body);
        await userRepository.save(user);
        res.status(200).json({
            message: 'User metrics updated successfully',
            user: {
                name: user.name,
                email: user.email,
                weight: user.weight,
                height: user.height,
                gender: user.gender,
                age: user.age,
                timesPerWeek: user.timesPerWeek,
                timePerSession: user.timePerSession,
                repRange: user.repRange
            }
        });
    }
    catch (error) {
        console.error('Error updating user metrics:', error);
        res.status(500).json({ message: 'Error updating user metrics' });
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
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id: req.user.id } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
            weight: user.weight,
            height: user.height,
            gender: user.gender,
            age: user.age,
            timesPerWeek: user.timesPerWeek,
            timePerSession: user.timePerSession,
            repRange: user.repRange,
            isAdmin: user.isAdmin
        });
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};
exports.getUser = getUser;
const deleteUser = async (req, res) => {
    var _a;
    try {
        const { userId } = req.params;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
        const requestingUser = await userRepository.findOne({ where: { id: req.user.id } });
        if (!(requestingUser === null || requestingUser === void 0 ? void 0 : requestingUser.isAdmin)) {
            res.status(403).json({ message: 'Only admins can delete users' });
            return;
        }
        const userToDelete = await userRepository.findOne({ where: { id: userId } });
        if (!userToDelete) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        await activityLogRepository.delete({ userId: userId });
        await userRepository.remove(userToDelete);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map