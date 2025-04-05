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
const fs_1 = __importDefault(require("fs"));
// Define uploads directory correctly - going up one level from src
const UPLOADS_DIR = path_1.default.join(__dirname, '..', 'uploads');
// Ensure 'uploads/' directory exists
if (!fs_1.default.existsSync(UPLOADS_DIR)) {
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
const app = (0, express_1.default)();
// Configure multer storage with proper path
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
// File filter to allow only video files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only video files are allowed!'));
    }
};
// Initialize multer with a file size limit (100MB)
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: fileFilter,
});
// Update static file serving path
app.use('/uploads', express_1.default.static(UPLOADS_DIR));
// Upload video endpoint
app.post('/api/upload', upload.single('video'), (req, res, next) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
    }
    res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});
// Download video endpoint - fixed path
app.get('/api/download/:filename', (req, res, next) => {
    const filePath = path_1.default.join(UPLOADS_DIR, req.params.filename);
    console.log('Looking for file at:', filePath);
    console.log('__dirname is:', __dirname);
    console.log('UPLOADS_DIR is:', UPLOADS_DIR);
    // Check if file exists
    if (!fs_1.default.existsSync(filePath)) {
        console.log('File does not exist at this path');
        // @ts-ignore
        return res.status(404).json({ message: 'File not found.' });
    }
    res.download(filePath, (err) => {
        if (err) {
            console.log('Download error:', err);
            res.status(404).json({ message: 'File not found.' });
        }
    });
});
// Get all videos endpoint - fixed path
app.get('/api/videos', (req, res) => {
    try {
        fs_1.default.readdir(UPLOADS_DIR, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return res.status(500).json({ message: 'Error reading uploads directory' });
            }
            const videoFiles = files
                .filter(file => file.match(/\.(mp4|mov|avi|wmv|mkv|webm)$/i))
                .map(fileName => {
                const stats = fs_1.default.statSync(path_1.default.join(UPLOADS_DIR, fileName));
                return {
                    fileName: fileName,
                    filePath: `/uploads/${fileName}`,
                    uploadDate: stats.mtime.toISOString()
                };
            })
                .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
            res.json(videoFiles);
        });
    }
    catch (error) {
        console.error('Error getting videos:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/trainings', trainingroutes_1.default);
app.use('/api/user', userroutes_1.default);
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
