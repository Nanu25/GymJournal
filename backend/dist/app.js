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
// Ensure 'uploads/' directory exists
if (!fs_1.default.existsSync('uploads')) {
    fs_1.default.mkdirSync('uploads');
}
const app = (0, express_1.default)();
// Configure multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
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
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Upload video endpoint
app.post('/api/upload', upload.single('video'), (req, res, next) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
    }
    res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});
// Download video endpoint
app.get('/api/download/:filename', (req, res, next) => {
    const filePath = path_1.default.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'File not found.' });
        }
    });
});
// Add this to backend/src/app.ts
// Get all videos endpoint
app.get('/api/videos', (req, res) => {
    try {
        const uploadsDir = path_1.default.join(__dirname, 'uploads');
        fs_1.default.readdir(uploadsDir, (err, files) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading uploads directory' });
            }
            const videoFiles = files
                .filter(file => file.match(/\.(mp4|mov|avi|wmv|mkv|webm)$/i))
                .map(fileName => {
                const stats = fs_1.default.statSync(path_1.default.join(uploadsDir, fileName));
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
