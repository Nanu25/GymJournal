"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ActivityLogController_1 = require("../controllers/ActivityLogController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.isAdmin, ActivityLogController_1.ActivityLogController.getActivityLogs);
exports.default = router;
//# sourceMappingURL=activityLog.routes.js.map