import { ActivityLog, ActionType } from '../entities/ActivityLog';
import { AppDataSource } from '../config/database';

export class LoggingService {
    private static activityLogRepository = AppDataSource.getRepository(ActivityLog);

    static async logActivity(
        userId: number,
        action: ActionType,
        entityType: string,
        entityId?: string,
        details?: Record<string, any>
    ): Promise<void> {
        const log = new ActivityLog();
        log.userId = userId;
        log.action = action;
        log.entityType = entityType;
        if (entityId) log.entityId = Number(entityId);
        if (details) log.details = details;

        await this.activityLogRepository.save(log);
    }

    static async getActivityLogs(
        userId?: number,
        entityType?: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<ActivityLog[]> {
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