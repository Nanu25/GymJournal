import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import 'dotenv/config';
import trainingRoutes from './routes/trainingroutes';
import userRoutes from './routes/userroutes';
import exerciseRoutes from './routes/exerciseroutes';
import activityLogRoutes from './routes/activityLog.routes';
import fs from 'fs';
import { AppDataSource, initializeDatabase } from './config/database';
import { AuthController } from './controllers/auth.controller';
import { authenticateToken } from './middleware/auth';
// Import for debugging
import { createTraining, debugTrainingController } from './controllers/TrainingController';

console.log('[APP] Starting Gym Journal API server...');
console.log('[APP] Node environment:', process.env.NODE_ENV);
console.log('[APP] Current directory:', __dirname);

// Ensure 'uploads/' directory exists in both development and production
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const app = express();

// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:5173', // Vite dev server
        'http://localhost:3000',
        'https://gym-journal-frontend.vercel.app', // Your Vercel frontend URL
        'https://gymjournal-75451ef51cbf.herokuapp.com', // Your Heroku domain
        /\.vercel\.app$/, // Allow any vercel.app subdomain
        /\.herokuapp\.com$/ // Allow any herokuapp.com subdomain
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    console.log(`[REQUEST] ${req.method} ${req.url} - Started`);
    
    // Add response finished handler
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[REQUEST] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(publicDir));

// Root path handler - serve the React app
app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(publicDir, 'index.html'));
});

// API status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
    console.log('[API] Status endpoint called');
    res.json({ 
        message: 'Gym Journal API is running', 
        time: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        dbConnected: AppDataSource.isInitialized 
    });
});

// Define a request type that includes the `file` property for multer
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, uploadsDir);
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

app.use('/uploads', express.static(uploadsDir));

// Upload video endpoint
app.post('/api/upload', upload.single('video'), (req: MulterRequest, res: Response, _next: NextFunction): void => {
    console.log('[API] Upload endpoint called');
    if (!req.file) {
        console.log('[API] Upload failed - no file');
        res.status(400).json({ message: 'No file uploaded.' });
        return;
    }

    console.log('[API] Upload successful:', req.file.filename);
    res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});

// Download video endpoint
app.get('/api/download/:filename', (req: Request, res: Response, _next: NextFunction): void => {
    const filePath: string = path.join(uploadsDir, req.params.filename);
    console.log('[API] Download endpoint called for file:', req.params.filename);

    res.download(filePath, (err: Error | null) => {
        if (err) {
            console.log('[API] Download failed:', err.message);
            res.status(404).json({ message: 'File not found.' });
        } else {
            console.log('[API] Download successful');
        }
    });
});

// Get all videos endpoint
app.get('/api/videos', (_req: Request, res: Response): void => {
    console.log('[API] Videos endpoint called');
    try {
        fs.readdir(uploadsDir, (err, files) => {
            if (err) {
                console.error('[API] Error reading directory:', err);
                res.status(500).json({ message: 'Error reading videos directory' });
                return;
            }
            const videoFiles = files.filter(file => file.match(/\.(mp4|mov|avi)$/i));
            console.log('[API] Videos endpoint returning', videoFiles.length, 'files');
            res.status(200).json(videoFiles);
        });
    } catch (error) {
        console.error('[API] Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add exercise routes (no authentication required for read-only data)
app.use('/api/exercises', exerciseRoutes);

// Add user routes with authentication
app.use('/api/user', authenticateToken, userRoutes);

// Add training routes with authentication
app.use('/api/trainings', authenticateToken, trainingRoutes);

// Add activity log routes (admin only)
app.use('/api/activity-logs', authenticateToken, activityLogRoutes);

// Auth routes
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);

// Add debug routes in non-production environments
if (process.env.NODE_ENV !== 'production') {
    console.log('[APP] Adding debug routes (non-production environment)');
    
    app.get('/api/debug/trainings', debugTrainingController);
    
    // Debug route to test direct training creation
    app.post('/api/debug/trainings', (req: Request, res: Response) => {
        console.log('[DEBUG] Direct training creation test');
        console.log('[DEBUG] Request body:', req.body);
        
        // Set mock user for testing
        req.user = { id: 1 };
        
        createTraining(req, res);
    });
}

// Fallback: serve index.html for any non-API route (for React Router)
app.get('*', (req: Request, res: Response) => {
    if (req.path.startsWith('/api/')) return;
    res.sendFile(path.join(publicDir, 'index.html'));
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[ERROR]', req.method, req.url, err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message,
        path: req.url
    });
});

// Use our new database initialization function
console.log('[APP] Starting database initialization...');

initializeDatabase()
    .then((success) => {
        if (!success) {
            console.error('[APP] Database initialization failed. Exiting.');
            process.exit(1);
        }
        
        console.log('[APP] Database initialization successful!');
        // Only start the server after database connection is established
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`[APP] Server is running on port ${PORT}`);
            console.log(`[APP] API available at http://localhost:${PORT}/api`);
        });
    })
    .catch((error) => {
        console.error('[APP] Error during database initialization:', error);
        process.exit(1); // Exit if database connection fails
    });
