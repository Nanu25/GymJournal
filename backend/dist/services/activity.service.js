"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const database_1 = require("../config/database");
const ActivityLog_1 = require("../entities/ActivityLog");
const User_1 = require("../entities/User");
const typeorm_1 = require("typeorm");
const activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
class ActivityService {
    static async logActivity(userId, action, entityType, entityId, details) {
        const log = activityLogRepository.create({
            userId,
            action,
            entityType,
            entityId,
            details
        });
        return await activityLogRepository.save(log);
    }
    static async analyzeActivity(timeWindowMinutes = 5, threshold = 50) {
        const now = new Date();
        const timeWindowStart = new Date(now.getTime() - timeWindowMinutes * 60000);
        const recentLogs = await activityLogRepository.find({
            where: {
                timestamp: (0, typeorm_1.Between)(timeWindowStart, now)
            },
            relations: ['user']
        });
        const userActivityCounts = new Map();
        recentLogs.forEach(log => {
            const count = userActivityCounts.get(log.userId) || 0;
            userActivityCounts.set(log.userId, count + 1);
        });
        for (const [userId, count] of userActivityCounts.entries()) {
            if (count > threshold) {
                await userRepository.update(userId, { isMonitored: true });
            }
        }
    }
    static async getMonitoredUsers() {
        return await userRepository.find({
            where: { isMonitored: true }
        });
    }
    static async getUserActivity(userId, startDate, endDate) {
        const where = { userId };
        if (startDate && endDate) {
            where.timestamp = (0, typeorm_1.Between)(startDate, endDate);
        }
        else if (startDate) {
            where.timestamp = (0, typeorm_1.MoreThanOrEqual)(startDate);
        }
        else if (endDate) {
            where.timestamp = (0, typeorm_1.LessThanOrEqual)(endDate);
        }
        return await activityLogRepository.find({
            where,
            order: { timestamp: 'DESC' }
        });
    }
}
exports.ActivityService = ActivityService;
//# sourceMappingURL=activity.service.js.map