"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const ActivityLog_1 = require("../entities/ActivityLog");
const MonitoredUser_1 = require("../entities/MonitoredUser");
const User_1 = require("../entities/User");
const activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
const monitoredUserRepository = database_1.AppDataSource.getRepository(MonitoredUser_1.MonitoredUser);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const ACTION_THRESHOLD = 10;
const TIME_WINDOW_MINUTES = 1;
async function monitorSuspiciousUsers() {
    await database_1.AppDataSource.initialize();
    console.log('Monitoring thread started');
    setInterval(async () => {
        const since = new Date(Date.now() - TIME_WINDOW_MINUTES * 60 * 1000);
        const logs = await activityLogRepository
            .createQueryBuilder('log')
            .select('log.userId')
            .addSelect('COUNT(*)', 'actionCount')
            .where('log.timestamp > :since', { since })
            .groupBy('log.userId')
            .having('COUNT(*) > :threshold', { threshold: ACTION_THRESHOLD })
            .getRawMany();
        for (const entry of logs) {
            const userId = entry.log_userId;
            const actionCount = entry.actionCount;
            const alreadyMonitored = await monitoredUserRepository.findOne({ where: { userId } });
            if (!alreadyMonitored) {
                const user = await userRepository.findOne({ where: { id: userId } });
                const username = user ? user.name : 'Unknown';
                await monitoredUserRepository.save({
                    userId,
                    username,
                    reason: `High activity: ${actionCount} actions in ${TIME_WINDOW_MINUTES} min`,
                    detectedAt: new Date(),
                });
                console.log(`User ${username} (${userId}) added to monitored list.`);
            }
        }
    }, 60 * 500);
}
monitorSuspiciousUsers();
//# sourceMappingURL=monitorSuspiciousUsers.js.map