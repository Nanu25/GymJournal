"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUser = exports.updateUserMetrics = exports.getUserMetrics = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const ActivityLog_1 = require("../entities/ActivityLog");
const getUserMetrics = async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    console.log('[USER_CONTROLLER] getUserMetrics called');
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            console.log('[USER_CONTROLLER] No user ID found in request');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        console.log('[USER_CONTROLLER] Fetching user with ID:', req.user.id);
        console.time('[USER_CONTROLLER] userQuery');
        let useMock = false;
        let user = null;
        try {
            if (!database_1.AppDataSource.isInitialized) {
                console.error('[USER_CONTROLLER] ERROR: Database connection not initialized');
                useMock = true;
            }
            else {
                console.log('[USER_CONTROLLER] Database connection is active, querying user');
                const userRepository = database_1.AppDataSource.getRepository(User_1.User);
                user = await userRepository.findOne({ where: { id: req.user.id } });
                if (!user) {
                    console.log('[USER_CONTROLLER] User not found for ID:', req.user.id);
                    useMock = true;
                }
            }
        }
        catch (dbError) {
            console.error('[USER_CONTROLLER] Database query error:', dbError);
            useMock = true;
        }
        console.timeEnd('[USER_CONTROLLER] userQuery');
        if (useMock) {
            console.log('[USER_CONTROLLER] Using mock data as fallback');
            const mockUserData = {
                name: "Fitness Enthusiast",
                email: "test@example.com",
                weight: 75,
                height: 180,
                gender: 'Male',
                age: 30,
                timesPerWeek: 3,
                timePerSession: 60,
                repRange: '8-12',
                isAdmin: false
            };
            res.status(200).json(mockUserData);
            return;
        }
        console.log('[USER_CONTROLLER] User found, name value:', user.name);
        const responseData = {
            name: user.name,
            email: user.email,
            weight: (_b = user.weight) !== null && _b !== void 0 ? _b : 0,
            height: (_c = user.height) !== null && _c !== void 0 ? _c : 0,
            gender: (_d = user.gender) !== null && _d !== void 0 ? _d : '',
            age: (_e = user.age) !== null && _e !== void 0 ? _e : 0,
            timesPerWeek: (_f = user.timesPerWeek) !== null && _f !== void 0 ? _f : 0,
            timePerSession: (_g = user.timePerSession) !== null && _g !== void 0 ? _g : 0,
            repRange: (_h = user.repRange) !== null && _h !== void 0 ? _h : '',
            isAdmin: (_j = user.isAdmin) !== null && _j !== void 0 ? _j : false
        };
        console.log('[USER_CONTROLLER] Sending response:', responseData);
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error('[USER_CONTROLLER] Error fetching user metrics:', error);
        console.log('[USER_CONTROLLER] Using mock data due to unexpected error');
        const mockUserData = {
            name: "Fitness Enthusiast",
            email: "test@example.com",
            weight: 75,
            height: 180,
            gender: 'Male',
            age: 30,
            timesPerWeek: 3,
            timePerSession: 60,
            repRange: '8-12',
            isAdmin: false
        };
        res.status(200).json(mockUserData);
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    console.log('[USER_CONTROLLER] getUser called');
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            console.log('[USER_CONTROLLER] No user ID found in request');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        console.log('[USER_CONTROLLER] Fetching user with ID:', req.user.id);
        console.time('[USER_CONTROLLER] userQuery');
        let useMock = false;
        let user = null;
        try {
            if (!database_1.AppDataSource.isInitialized) {
                console.error('[USER_CONTROLLER] ERROR: Database connection not initialized');
                useMock = true;
            }
            else {
                console.log('[USER_CONTROLLER] Database connection is active, querying user');
                const userRepository = database_1.AppDataSource.getRepository(User_1.User);
                user = await userRepository.findOne({ where: { id: req.user.id } });
                if (!user) {
                    console.log('[USER_CONTROLLER] User not found for ID:', req.user.id);
                    useMock = true;
                }
            }
        }
        catch (dbError) {
            console.error('[USER_CONTROLLER] Database query error:', dbError);
            useMock = true;
        }
        console.timeEnd('[USER_CONTROLLER] userQuery');
        if (useMock) {
            console.log('[USER_CONTROLLER] Using mock data as fallback');
            const mockUserData = {
                name: "Fitness Enthusiast",
                email: "test@example.com",
                weight: 75,
                height: 180,
                gender: 'Male',
                age: 30,
                timesPerWeek: 3,
                timePerSession: 60,
                repRange: '8-12',
                isAdmin: false
            };
            res.status(200).json(mockUserData);
            return;
        }
        console.log('[USER_CONTROLLER] User found, name value:', user.name);
        const responseData = {
            name: user.name,
            email: user.email,
            weight: (_b = user.weight) !== null && _b !== void 0 ? _b : 0,
            height: (_c = user.height) !== null && _c !== void 0 ? _c : 0,
            gender: (_d = user.gender) !== null && _d !== void 0 ? _d : '',
            age: (_e = user.age) !== null && _e !== void 0 ? _e : 0,
            timesPerWeek: (_f = user.timesPerWeek) !== null && _f !== void 0 ? _f : 0,
            timePerSession: (_g = user.timePerSession) !== null && _g !== void 0 ? _g : 0,
            repRange: (_h = user.repRange) !== null && _h !== void 0 ? _h : '',
            isAdmin: (_j = user.isAdmin) !== null && _j !== void 0 ? _j : false
        };
        console.log('[USER_CONTROLLER] Sending response:', responseData);
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error('[USER_CONTROLLER] Error fetching user:', error);
        console.log('[USER_CONTROLLER] Using mock data due to unexpected error');
        const mockUserData = {
            name: "Fitness Enthusiast",
            email: "test@example.com",
            weight: 75,
            height: 180,
            gender: 'Male',
            age: 30,
            timesPerWeek: 3,
            timePerSession: 60,
            repRange: '8-12',
            isAdmin: false
        };
        res.status(200).json(mockUserData);
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
        const requestingUserRepository = database_1.AppDataSource.getRepository(User_1.User);
        const requestingUser = await requestingUserRepository.findOne({ where: { id: req.user.id } });
        if (!requestingUser || !requestingUser.isAdmin) {
            res.status(403).json({ message: 'You do not have permission to delete users' });
            return;
        }
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const userToDelete = await userRepository.findOne({ where: { id: userId } });
        if (!userToDelete) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
        await activityLogRepository.save({
            userId: req.user.id,
            action: ActivityLog_1.ActionType.DELETE,
            entityType: 'User',
            entityId: userId,
            details: { deletedUser: userToDelete.email },
            timestamp: new Date()
        });
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