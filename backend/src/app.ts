import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import trainingRoutes from './routes/trainingroutes';
import userRoutes from './routes/userroutes';
import fs from 'fs';

// Define uploads directory correctly - going up one level from src
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure 'uploads/' directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const app = express();

// Define a request type that includes the `file` property for multer
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// Configure multer storage with proper path
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter to allow only video files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'));
    }
};

// Initialize multer with a file size limit (100MB)
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: fileFilter,
});

// Update static file serving path
app.use('/uploads', express.static(UPLOADS_DIR));

// Upload video endpoint
app.post('/api/upload', upload.single('video'), (req: MulterRequest, res: Response, next: NextFunction): void => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
    }

    res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});

// Download video endpoint - fixed path
app.get('/api/download/:filename', (req: Request, res: Response, next: NextFunction): void => {
    const filePath: string = path.join(UPLOADS_DIR, req.params.filename);
    console.log('Looking for file at:', filePath);
    console.log('__dirname is:', __dirname);
    console.log('UPLOADS_DIR is:', UPLOADS_DIR);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.log('File does not exist at this path');
        // @ts-ignore
        return res.status(404).json({ message: 'File not found.' });
    }

    res.download(filePath, (err: Error | null) => {
        if (err) {
            console.log('Download error:', err);
            res.status(404).json({ message: 'File not found.' });
        }
    });
});

// Get all videos endpoint - fixed path
app.get('/api/videos', (req: Request, res: Response): void => {
    try {
        fs.readdir(UPLOADS_DIR, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                return res.status(500).json({ message: 'Error reading uploads directory' });
            }

            const videoFiles = files
                .filter(file => file.match(/\.(mp4|mov|avi|wmv|mkv|webm)$/i))
                .map(fileName => {
                    const stats = fs.statSync(path.join(UPLOADS_DIR, fileName));
                    return {
                        fileName: fileName,
                        filePath: `/uploads/${fileName}`,
                        uploadDate: stats.mtime.toISOString()
                    };
                })
                .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

            res.json(videoFiles);
        });
    } catch (error) {
        console.error('Error getting videos:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/trainings', trainingRoutes);
app.use('/api/user', userRoutes);

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});