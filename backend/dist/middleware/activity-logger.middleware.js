"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogger = void 0;
const activity_service_1 = require("../services/activity.service");
const ActivityLog_1 = require("../entities/ActivityLog");
const activityLogger = (entityType) => {
    return async (req, res, next) => {
        var _a;
        const originalSend = res.send;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next();
        }
        let action;
        switch (req.method) {
            case 'POST':
                action = ActivityLog_1.ActionType.CREATE;
                break;
            case 'GET':
                action = ActivityLog_1.ActionType.READ;
                break;
            case 'PUT':
            case 'PATCH':
                action = ActivityLog_1.ActionType.UPDATE;
                break;
            case 'DELETE':
                action = ActivityLog_1.ActionType.DELETE;
                break;
            default:
                return next();
        }
        const entityId = req.params.id || req.body.id;
        res.send = function (body) {
            res.send = originalSend;
            const response = res.send(body);
            activity_service_1.ActivityService.logActivity(userId, action, entityType, entityId, {
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                requestBody: req.body,
                responseBody: body
            }).catch(error => {
                console.error('Error logging activity:', error);
            });
            return response;
        };
        next();
    };
};
exports.activityLogger = activityLogger;
//# sourceMappingURL=activity-logger.middleware.js.map