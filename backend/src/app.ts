import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import trainingRoutes from './routes/trainingroutes';
import userRoutes from './routes/userroutes';
import fs from 'fs';

// Ensure 'uploads/' directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}


const app = express();

// Define a request type that includes the `file` property for multer
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'uploads/');
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload video endpoint
app.post('/api/upload', upload.single('video'), (req: MulterRequest, res: Response, next: NextFunction): void => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
    }

    res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});

// Download video endpoint
app.get('/api/download/:filename', (req: Request, res: Response, next: NextFunction): void => {
    const filePath: string = path.join(__dirname, 'uploads', req.params.filename);

    res.download(filePath, (err: Error | null) => {
        if (err) {
            res.status(404).json({ message: 'File not found.' });
        }
    });
});

// Add this to backend/src/app.ts

// Get all videos endpoint
app.get('/api/videos', (req: Request, res: Response): void => {
    try {
        const uploadsDir = path.join(__dirname, 'uploads');
        fs.readdir(uploadsDir, (err, files) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading uploads directory' });
            }

            const videoFiles = files
                .filter(file => file.match(/\.(mp4|mov|avi|wmv|mkv|webm)$/i))
                .map(fileName => {
                    const stats = fs.statSync(path.join(uploadsDir, fileName));
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
