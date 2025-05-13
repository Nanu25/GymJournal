"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_1 = require("../entities/User");
const router = express_1.default.Router();
const adminMiddleware = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== User_1.UserRole.ADMIN) {
        res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        return;
    }
    next();
};
router.use(auth_middleware_1.authMiddleware);
router.use(adminMiddleware);
router.get('/monitored-users', admin_controller_1.AdminController.getMonitoredUsers);
router.get('/user-activity/:userId', admin_controller_1.AdminController.getUserActivity);
router.put('/users/:userId/role', admin_controller_1.AdminController.updateUserRole);
router.put('/users/:userId/monitoring', admin_controller_1.AdminController.toggleUserMonitoring);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map