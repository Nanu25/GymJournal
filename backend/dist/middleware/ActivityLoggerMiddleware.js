"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLoggerMiddleware = void 0;
const LoggingService_1 = require("../services/LoggingService");
class ActivityLoggerMiddleware {
    static logActivity(actionType) {
        return async (req, res, next) => {
            const originalSend = res.send;
            const originalJson = res.json;
            res.send = function (body) {
                res.locals.responseBody = body;
                return originalSend.call(this, body);
            };
            res.json = function (body) {
                res.locals.responseBody = body;
                return originalJson.call(this, body);
            };
            res.on('finish', async () => {
                var _a;
                try {
                    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                    if (!userId) {
                        console.error('No user ID found in request');
                        return;
                    }
                    const entityId = req.params.id || req.params.date || undefined;
                    const details = {
                        method: req.method,
                        path: req.path,
                        body: req.body,
                        params: req.params,
                        query: req.query,
                        response: res.locals.responseBody,
                        statusCode: res.statusCode
                    };
                    await LoggingService_1.LoggingService.logActivity(userId, actionType, req.path.split('/')[2] || 'unknown', entityId, details);
                }
                catch (error) {
                    console.error('Error logging activity:', error);
                }
            });
            next();
        };
    }
}
exports.ActivityLoggerMiddleware = ActivityLoggerMiddleware;
//# sourceMappingURL=ActivityLoggerMiddleware.js.map