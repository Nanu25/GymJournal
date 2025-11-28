"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const compression_1 = __importDefault(require("compression"));
const trainingroutes_1 = __importDefault(require("./routes/trainingroutes"));
const userroutes_1 = __importDefault(require("./routes/userroutes"));
const exerciseroutes_1 = __importDefault(require("./routes/exerciseroutes"));
const activityLog_routes_1 = __importDefault(require("./routes/activityLog.routes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const fs_1 = __importDefault(require("fs"));
const database_1 = require("./config/database");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_1 = require("./middleware/auth");
const error_middleware_1 = require("./middleware/error.middleware");
const publicDir = path_1.default.join(__dirname, '..', 'public');
if (!fs_1.default.existsSync(publicDir)) {
    fs_1.default.mkdirSync(publicDir, { recursive: true });
}
if (!process.env.JWT_SECRET) {
    console.error('[FATAL] JWT_SECRET is not defined in environment variables.');
    process.exit(1);
}
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://gym-journal-frontend.vercel.app',
        'https://gymjournal-75451ef51cbf.herokuapp.com',
        /\.vercel\.app$/,
        /\.herokuapp\.com$/
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
    credentials: true
};
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use((0, compression_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.static(publicDir));
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/'))
        return next();
    res.sendFile(path_1.default.join(publicDir, 'index.html'));
});
app.get('/api/status', (_req, res) => {
    res.json({
        message: 'Gym Journal API is running',
        time: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        dbConnected: database_1.AppDataSource.isInitialized
    });
});
app.use('/api/exercises', exerciseroutes_1.default);
app.use('/api/user', auth_1.authenticateToken, userroutes_1.default);
app.use('/api/trainings', auth_1.authenticateToken, trainingroutes_1.default);
app.use('/api/activity-logs', auth_1.authenticateToken, activityLog_routes_1.default);
app.use('/api', chatRoutes_1.default);
app.post('/api/auth/register', auth_controller_1.AuthController.register);
app.post('/api/auth/login', auth_controller_1.AuthController.login);
app.post('/api/auth/google', auth_controller_1.AuthController.loginWithGoogle);
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/'))
        return;
    res.sendFile(path_1.default.join(publicDir, 'index.html'));
});
app.use(error_middleware_1.errorHandler);
console.log('[APP] Starting database initialization...');
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`[APP] Server is running on port ${PORT}`);
    console.log(`[APP] API available at http://localhost:${PORT}/api`);
});
(0, database_1.initializeDatabase)()
    .then((success) => {
    if (!success) {
        console.error('[APP] Database initialization failed, but server is running.');
        console.error('[APP] Some features may not work properly.');
    }
    else {
        console.log('[APP] Database initialization successful!');
    }
})
    .catch((error) => {
    console.error('[APP] Error during database initialization:', error);
    console.error('[APP] Server is running but database features may not work.');
});
process.on('SIGTERM', () => {
    console.log('[APP] SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('[APP] Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('[APP] SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('[APP] Server closed');
        process.exit(0);
    });
});
//# sourceMappingURL=app.js.map