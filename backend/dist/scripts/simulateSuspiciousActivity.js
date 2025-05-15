"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const ActivityLog_1 = require("../entities/ActivityLog");
const User_1 = require("../entities/User");
const activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
async function simulateSuspiciousActivity() {
    await database_1.AppDataSource.initialize();
    console.log('Simulating suspicious activity...');
    const user = await userRepository.findOne({ where: { email: 'ion@gmail.com' } });
    if (!user) {
        console.error('User not found');
        return;
    }
    const now = new Date();
    for (let i = 0; i < 20; i++) {
        const log = new ActivityLog_1.ActivityLog();
        log.userId = user.id;
        log.action = ActivityLog_1.ActionType.UPDATE;
        log.entityType = 'Training';
        log.entityId = null;
        log.details = { simulated: true, index: i };
        log.timestamp = new Date(now.getTime());
        await activityLogRepository.save(log);
        console.log(`Inserted log ${i + 1}`);
    }
    console.log('Simulation complete.');
    await database_1.AppDataSource.destroy();
}
simulateSuspiciousActivity();
//# sourceMappingURL=simulateSuspiciousActivity.js.map