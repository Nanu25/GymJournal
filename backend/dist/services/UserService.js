"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const database_1 = require("../config/database");
class UserService {
    static async getUserMetrics(userId) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let user = null;
        let useMock = false;
        try {
            if (!database_1.AppDataSource.isInitialized) {
                console.error('[USER_SERVICE] ERROR: Database connection not initialized');
                useMock = true;
            }
            else {
                user = await UserRepository_1.UserRepository.findById(userId);
                if (!user) {
                    useMock = true;
                }
            }
        }
        catch (error) {
            console.error('[USER_SERVICE] Database query error:', error);
            useMock = true;
        }
        if (useMock) {
            return {
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
        }
        return {
            name: user.name,
            email: user.email,
            weight: (_a = user.weight) !== null && _a !== void 0 ? _a : 0,
            height: (_b = user.height) !== null && _b !== void 0 ? _b : 0,
            gender: (_c = user.gender) !== null && _c !== void 0 ? _c : '',
            age: (_d = user.age) !== null && _d !== void 0 ? _d : 0,
            timesPerWeek: (_e = user.timesPerWeek) !== null && _e !== void 0 ? _e : 0,
            timePerSession: (_f = user.timePerSession) !== null && _f !== void 0 ? _f : 0,
            repRange: (_g = user.repRange) !== null && _g !== void 0 ? _g : '',
            isAdmin: (_h = user.isAdmin) !== null && _h !== void 0 ? _h : false
        };
    }
    static async updateUserMetrics(userId, updateData) {
        const user = await UserRepository_1.UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        Object.assign(user, updateData);
        await UserRepository_1.UserRepository.save(user);
        return {
            name: user.name,
            email: user.email,
            weight: user.weight,
            height: user.height,
            gender: user.gender,
            age: user.age,
            timesPerWeek: user.timesPerWeek,
            timePerSession: user.timePerSession,
            repRange: user.repRange
        };
    }
    static async getUser(userId) {
        return this.getUserMetrics(userId);
    }
    static async updateUserProfile(userId, updateData) {
        const user = await UserRepository_1.UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && updateData[key] !== null && updateData[key] !== '') {
                user[key] = updateData[key];
            }
        });
        await UserRepository_1.UserRepository.save(user);
        return {
            id: user.id,
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
        };
    }
    static async deleteUser(userId, requestingUserId) {
        const requestingUser = await UserRepository_1.UserRepository.findById(requestingUserId);
        if (!requestingUser || !requestingUser.isAdmin) {
            throw new Error('Permission denied');
        }
        const userToDelete = await UserRepository_1.UserRepository.findById(userId);
        if (!userToDelete) {
            throw new Error('User not found');
        }
        const deletedUserEmail = userToDelete.email;
        await UserRepository_1.UserRepository.remove(userToDelete);
        return deletedUserEmail;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map