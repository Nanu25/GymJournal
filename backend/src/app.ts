import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import trainingRoutes from './routes/trainingroutes';
import userRoutes from './routes/userroutes';
import activityLogRoutes from './routes/activityLog.routes';
import fs from 'fs';
import { AppDataSource } from './config/database';
import { AuthController } from './controllers/auth.controller';
import { authenticateToken } from './middleware/auth';
import monitoredUserRoutes from './routes/monitoredUser.routes';
import exerciseRoutes from './routes/exerciseroutes';

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
    destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'uploads/');
    },
    filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, file.originalname);
    }
});

// File filter to allow only video files
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed'));
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
app.post('/api/upload', upload.single('video'), (req: MulterRequest, res: Response, _next: NextFunction): void => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded.' });
        return;
    }

    res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});

// Download video endpoint
app.get('/api/download/:filename', (req: Request, res: Response, _next: NextFunction): void => {
    const filePath: string = path.join(__dirname, 'uploads', req.params.filename);

    res.download(filePath, (err: Error | null) => {
        if (err) {
            res.status(404).json({ message: 'File not found.' });
        }
    });
});

// Get all videos endpoint
app.get('/api/videos', (_req: Request, res: Response): void => {
    try {
        const uploadsDir = path.join(__dirname, 'uploads');
        fs.readdir(uploadsDir, (err, files) => {
            if (err) {
                console.error('Error reading directory:', err);
                res.status(500).json({ message: 'Error reading videos directory' });
                return;
            }
            const videoFiles = files.filter(file => file.match(/\.(mp4|mov|avi)$/i));
            res.status(200).json(videoFiles);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
    })
    .catch((error) => {
        console.error('Error during database initialization:', error);
    });

// Add user routes with authentication
app.use('/api/user', authenticateToken, userRoutes);

// Add training routes with authentication
app.use('/api/trainings', authenticateToken, trainingRoutes);

// Add activity log routes (admin only)
app.use('/api/activity-logs', authenticateToken, activityLogRoutes);

// Add monitored user routes
app.use('/api/monitored-users', monitoredUserRoutes);

// Add exercise routes
app.use('/api/exercises', exerciseRoutes);

// Routes
app.post('/api/auth/login', AuthController.login);

app.post('/api/auth/register', AuthController.register);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
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
