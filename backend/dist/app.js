"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const trainingroutes_1 = __importDefault(require("./routes/trainingroutes"));
const userroutes_1 = __importDefault(require("./routes/userroutes"));
const activityLog_routes_1 = __importDefault(require("./routes/activityLog.routes"));
const fs_1 = __importDefault(require("fs"));
const database_1 = require("./config/database");
const auth_controller_1 = require("./controllers/auth.controller");
const ActivityLoggerMiddleware_1 = require("./middleware/ActivityLoggerMiddleware");
const ActivityLog_1 = require("./entities/ActivityLog");
const auth_1 = require("./middleware/auth");
if (!fs_1.default.existsSync('uploads')) {
    fs_1.default.mkdirSync('uploads');
}
const app = (0, express_1.default)();
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only video files are allowed'));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: fileFilter,
});
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.post('/api/upload', upload.single('video'), (req, res, _next) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
    }
    res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});
app.get('/api/download/:filename', (req, res, _next) => {
    const filePath = path_1.default.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'File not found.' });
        }
    });
});
app.get('/api/videos', (_req, res) => {
    try {
        const uploadsDir = path_1.default.join(__dirname, 'uploads');
        fs_1.default.readdir(uploadsDir, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                res.status(500).json({ message: 'Error reading videos directory' });
                return;
            }
            const videoFiles = files.filter(file => file.match(/\.(mp4|mov|avi)$/i));
            res.status(200).json(videoFiles);
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connection established');
})
    .catch((error) => {
    console.error('Error during database initialization:', error);
});
app.use('/api/trainings', auth_1.authenticateToken, (req, res, next) => {
    if (req.method === 'GET') {
        ActivityLoggerMiddleware_1.ActivityLoggerMiddleware.logActivity(ActivityLog_1.ActionType.READ)(req, res, next);
    }
    else if (req.method === 'POST') {
        ActivityLoggerMiddleware_1.ActivityLoggerMiddleware.logActivity(ActivityLog_1.ActionType.CREATE)(req, res, next);
    }
    else if (req.method === 'PUT') {
        ActivityLoggerMiddleware_1.ActivityLoggerMiddleware.logActivity(ActivityLog_1.ActionType.UPDATE)(req, res, next);
    }
    else if (req.method === 'DELETE') {
        ActivityLoggerMiddleware_1.ActivityLoggerMiddleware.logActivity(ActivityLog_1.ActionType.DELETE)(req, res, next);
    }
    else {
        next();
    }
}, trainingroutes_1.default);
app.use('/api/user', auth_1.authenticateToken, (req, res, next) => {
    if (req.method === 'GET') {
        ActivityLoggerMiddleware_1.ActivityLoggerMiddleware.logActivity(ActivityLog_1.ActionType.READ)(req, res, next);
    }
    else if (req.method === 'POST') {
        ActivityLoggerMiddleware_1.ActivityLoggerMiddleware.logActivity(ActivityLog_1.ActionType.CREATE)(req, res, next);
    }
    else if (req.method === 'PUT') {
        ActivityLoggerMiddleware_1.ActivityLoggerMiddleware.logActivity(ActivityLog_1.ActionType.UPDATE)(req, res, next);
    }
    else if (req.method === 'DELETE') {
        ActivityLoggerMiddleware_1.ActivityLoggerMiddleware.logActivity(ActivityLog_1.ActionType.DELETE)(req, res, next);
    }
    else {
        next();
    }
}, userroutes_1.default);
app.post('/api/auth/register', ActivityLoggerMiddleware_1.ActivityLoggerMiddleware.logActivity(ActivityLog_1.ActionType.CREATE), auth_controller_1.AuthController.register);
app.use('/api/activity-logs', auth_1.authenticateToken, activityLog_routes_1.default);
app.post('/api/auth/login', auth_controller_1.AuthController.login);
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map