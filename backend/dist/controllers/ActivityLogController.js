"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogController = void 0;
const LoggingService_1 = require("../services/LoggingService");
const asyncHandler_1 = require("../utils/asyncHandler");
class ActivityLogController {
}
exports.ActivityLogController = ActivityLogController;
_a = ActivityLogController;
ActivityLogController.getActivityLogs = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, entityType, startDate, endDate } = req.query;
    let userIdValue = undefined;
    if (userId !== undefined && userId !== '') {
        userIdValue = userId;
    }
    const logs = await LoggingService_1.LoggingService.getActivityLogs(userIdValue, entityType, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    res.json(logs);
});
//# sourceMappingURL=ActivityLogController.js.map