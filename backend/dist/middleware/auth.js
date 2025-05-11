"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../entities/User");
const database_1 = require("../config/database");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = { id: decoded.userId };
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
const isAdmin = async (req, res, next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user || !user.isAdmin) {
            res.status(403).json({ message: 'Forbidden: Admin access required' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Error in admin middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=auth.js.map