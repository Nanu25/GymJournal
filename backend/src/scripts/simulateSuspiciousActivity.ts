import { AppDataSource } from '../config/database';
import { ActivityLog, ActionType } from '../entities/ActivityLog';
import { User } from '../entities/User';

const activityLogRepository = AppDataSource.getRepository(ActivityLog);
const userRepository = AppDataSource.getRepository(User);

async function simulateSuspiciousActivity() {
    await AppDataSource.initialize();
    console.log('Simulating suspicious activity...');

    // Get a user (change email if needed)
    const user = await userRepository.findOne({ where: { email: 'nanu@gmail.com' } });
    if (!user) {
        console.error('User not found');
        return;
    }

    const now = new Date();
    for (let i = 0; i < 20; i++) { // 20 actions
        const log = new ActivityLog();
        log.userId = user.id;
        log.action = ActionType.UPDATE;
        log.entityType = 'Training';
        log.entityId = null;
        log.details = { simulated: true, index: i };
        log.timestamp = new Date(now.getTime()); // within last 30s
        await activityLogRepository.save(log);
        console.log(`Inserted log ${i + 1}`);
    }
    console.log('Simulation complete.');
    await AppDataSource.destroy();
}

simulateSuspiciousActivity(); 