"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
const ActivityLog_1 = require("../entities/ActivityLog");
const database_1 = require("../config/database");
class LoggingService {
    static async logActivity(userId, action, entityType, entityId, details) {
        const log = new ActivityLog_1.ActivityLog();
        log.userId = userId;
        log.action = action;
        log.entityType = entityType;
        if (entityId)
            log.entityId = typeof entityId === 'string' ? Number(entityId) : entityId;
        if (details)
            log.details = details;
        await this.activityLogRepository.save(log);
    }
    static async getActivityLogs(userId, entityType, startDate, endDate) {
        const queryBuilder = this.activityLogRepository
            .createQueryBuilder('log')
            .leftJoinAndSelect('log.user', 'user')
            .orderBy('log.timestamp', 'DESC');
        if (userId) {
            queryBuilder.andWhere('log.userId = :userId', { userId });
        }
        if (entityType) {
            queryBuilder.andWhere('log.entityType = :entityType', { entityType });
        }
        if (startDate) {
            queryBuilder.andWhere('log.timestamp >= :startDate', { startDate });
        }
        if (endDate) {
            queryBuilder.andWhere('log.timestamp <= :endDate', { endDate });
        }
        return queryBuilder.getMany();
    }
}
exports.LoggingService = LoggingService;
LoggingService.activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
//# sourceMappingURL=LoggingService.js.map