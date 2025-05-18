"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogController = void 0;
const LoggingService_1 = require("../services/LoggingService");
class ActivityLogController {
    static async getActivityLogs(req, res) {
        try {
            const { userId, entityType, startDate, endDate } = req.query;
            let userIdValue = undefined;
            if (userId !== undefined && userId !== '') {
                userIdValue = Number(userId);
            }
            const logs = await LoggingService_1.LoggingService.getActivityLogs(userIdValue, entityType, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
            res.json(logs);
        }
        catch (error) {
            console.error('Error fetching activity logs:', error);
            res.status(500).json({ message: 'Error fetching activity logs' });
        }
    }
}
exports.ActivityLogController = ActivityLogController;
//# sourceMappingURL=ActivityLogController.js.map