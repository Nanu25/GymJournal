"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const MonitoredUser_1 = require("../entities/MonitoredUser");
const auth_1 = require("../middleware/auth");
const User_1 = require("../entities/User");
const router = (0, express_1.Router)();
const monitoredUserRepository = database_1.AppDataSource.getRepository(MonitoredUser_1.MonitoredUser);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
function requireAdmin(req, res, next) {
    userRepository.findOne({ where: { id: req.user.id } }).then(user => {
        if (!user || !user.isAdmin) {
            res.status(403).json({ message: 'Admin privileges required' });
            return;
        }
        next();
    }).catch(() => {
        res.status(500).json({ message: 'Error checking admin status' });
    });
}
router.get('/', auth_1.authenticateToken, requireAdmin, async (_req, res) => {
    const monitoredUsers = await monitoredUserRepository.find();
    res.json(monitoredUsers);
});
router.delete('/:id', auth_1.authenticateToken, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const monitoredUser = await monitoredUserRepository.findOne({ where: { id } });
        if (!monitoredUser) {
            res.status(404).json({ message: 'Monitored user not found' });
            return;
        }
        await monitoredUserRepository.remove(monitoredUser);
        res.status(200).json({ message: 'Monitored user deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting monitored user', error });
    }
});
exports.default = router;
//# sourceMappingURL=monitoredUser.routes.js.map