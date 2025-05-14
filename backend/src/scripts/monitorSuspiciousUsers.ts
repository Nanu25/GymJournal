import { AppDataSource } from '../config/database';
import { ActivityLog } from '../entities/ActivityLog';
import { MonitoredUser } from '../entities/MonitoredUser';
import { User } from '../entities/User';

const activityLogRepository = AppDataSource.getRepository(ActivityLog);
const monitoredUserRepository = AppDataSource.getRepository(MonitoredUser);
const userRepository = AppDataSource.getRepository(User);

const ACTION_THRESHOLD = 10; // e.g., more than 10 actions
const TIME_WINDOW_MINUTES = 1; // in the last 1 minute

async function monitorSuspiciousUsers() {
    await AppDataSource.initialize();
    console.log('Monitoring thread started');

    setInterval(async () => {
        const since = new Date(Date.now() - TIME_WINDOW_MINUTES * 60 * 1000);
        // Find all users with more than ACTION_THRESHOLD actions in the time window
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
            // Check if already monitored
            const alreadyMonitored = await monitoredUserRepository.findOne({ where: { userId } });
            if (!alreadyMonitored) {
                // Get username
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
    }, 60 * 500); // Run every 30/sec
}

monitorSuspiciousUsers(); 