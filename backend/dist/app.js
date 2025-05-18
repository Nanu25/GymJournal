"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
require("dotenv/config");
const trainingroutes_1 = __importDefault(require("./routes/trainingroutes"));
const userroutes_1 = __importDefault(require("./routes/userroutes"));
const exerciseroutes_1 = __importDefault(require("./routes/exerciseroutes"));
const activityLog_routes_1 = __importDefault(require("./routes/activityLog.routes"));
const fs_1 = __importDefault(require("fs"));
const database_1 = require("./config/database");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_1 = require("./middleware/auth");
console.log('[APP] Starting Gym Journal API server...');
console.log('[APP] Node environment:', process.env.NODE_ENV);
console.log('[APP] Current directory:', __dirname);
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const publicDir = path_1.default.join(__dirname, '..', 'public');
if (!fs_1.default.existsSync(publicDir)) {
    fs_1.default.mkdirSync(publicDir, { recursive: true });
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
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[REQUEST] ${req.method} ${req.url} - Started`);
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[REQUEST] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.static(publicDir));
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/'))
        return next();
    res.sendFile(path_1.default.join(publicDir, 'index.html'));
});
app.get('/api/status', (_req, res) => {
    console.log('[API] Status endpoint called');
    res.json({
        message: 'Gym Journal API is running',
        time: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        dbConnected: database_1.AppDataSource.isInitialized
    });
});
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
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
app.use('/uploads', express_1.default.static(uploadsDir));
app.post('/api/upload', upload.single('video'), (req, res, _next) => {
    console.log('[API] Upload endpoint called');
    if (!req.file) {
        console.log('[API] Upload failed - no file');
        res.status(400).json({ message: 'No file uploaded.' });
        return;
    }
    console.log('[API] Upload successful:', req.file.filename);
    res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});
app.get('/api/download/:filename', (req, res, _next) => {
    const filePath = path_1.default.join(uploadsDir, req.params.filename);
    console.log('[API] Download endpoint called for file:', req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            console.log('[API] Download failed:', err.message);
            res.status(404).json({ message: 'File not found.' });
        }
        else {
            console.log('[API] Download successful');
        }
    });
});
app.get('/api/videos', (_req, res) => {
    console.log('[API] Videos endpoint called');
    try {
        fs_1.default.readdir(uploadsDir, (err, files) => {
            if (err) {
                console.error('[API] Error reading directory:', err);
                res.status(500).json({ message: 'Error reading videos directory' });
                return;
            }
            const videoFiles = files.filter(file => file.match(/\.(mp4|mov|avi)$/i));
            console.log('[API] Videos endpoint returning', videoFiles.length, 'files');
            res.status(200).json(videoFiles);
        });
    }
    catch (error) {
        console.error('[API] Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.use('/api/exercises', exerciseroutes_1.default);
app.use('/api/user', auth_1.authenticateToken, userroutes_1.default);
app.use('/api/trainings', auth_1.authenticateToken, trainingroutes_1.default);
app.use('/api/activity-logs', auth_1.authenticateToken, activityLog_routes_1.default);
app.post('/api/auth/register', auth_controller_1.AuthController.register);
app.post('/api/auth/login', auth_controller_1.AuthController.login);
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/'))
        return;
    res.sendFile(path_1.default.join(publicDir, 'index.html'));
});
app.use((err, req, res, _next) => {
    console.error('[ERROR]', req.method, req.url, err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message,
        path: req.url
    });
});
console.log('[APP] Starting database initialization...');
(0, database_1.initializeDatabase)()
    .then((success) => {
    if (!success) {
        console.error('[APP] Database initialization failed. Exiting.');
        process.exit(1);
    }
    console.log('[APP] Database initialization successful!');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`[APP] Server is running on port ${PORT}`);
        console.log(`[APP] API available at http://localhost:${PORT}/api`);
    });
})
    .catch((error) => {
    console.error('[APP] Error during database initialization:', error);
    process.exit(1);
});
//# sourceMappingURL=app.js.map