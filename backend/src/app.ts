import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';

import 'dotenv/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import trainingRoutes from './routes/trainingroutes';
import userRoutes from './routes/userroutes';
import exerciseRoutes from './routes/exerciseroutes';
import activityLogRoutes from './routes/activityLog.routes';
import chatRoutes from './routes/chatRoutes';
import fs from 'fs';
import { AppDataSource, initializeDatabase } from './config/database';
import { AuthController } from './controllers/auth.controller';
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/error.middleware';

const isVercel = !!process.env.VERCEL;

// Ensure public directory exists (only on local — Vercel filesystem is read-only)
if (!isVercel) {
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }
}

// On local dev, crash early if JWT_SECRET is missing.
// On Vercel, log a warning but don't crash the module — let the request handler return a proper error.
if (!process.env.JWT_SECRET) {
    if (!isVercel) {
        console.error('[FATAL] JWT_SECRET is not defined in environment variables.');
        process.exit(1);
    } else {
        console.error('[WARNING] JWT_SECRET is not defined. Auth endpoints will fail. Set it in Vercel Dashboard > Settings > Environment Variables.');
    }
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
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
    credentials: true
};

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter); // Apply to API routes only

app.use(cors(corsOptions));
app.use(express.json());

// Lazy database connection initialization for serverless (Vercel) cold starts.
// This MUST run before any route handler that uses the database.
app.use(async (req: Request, _res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api/') && !AppDataSource.isInitialized) {
        try {
            await initializeDatabase();
        } catch (error) {
            console.error('[APP] Error connecting to database on request:', error);
        }
    }
    next();
});

// Serve static files from the public directory (only relevant for local dev)
if (!isVercel) {
    const publicDir = path.join(__dirname, '..', 'public');
    app.use(express.static(publicDir));

    // Root path handler - serve the React app
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
        if (req.path.startsWith('/api/')) return next();
        res.sendFile(path.join(publicDir, 'index.html'));
    });
}

// API status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
    res.json({
        message: 'Gym Journal API is running',
        time: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        dbConnected: AppDataSource.isInitialized
    });
});

// Add exercise routes (no authentication required for read-only data)
app.use('/api/exercises', exerciseRoutes);

// Add user routes with authentication
app.use('/api/user', authenticateToken, userRoutes);

// Add training routes with authentication
app.use('/api/trainings', authenticateToken, trainingRoutes);

// Add activity log routes (admin only)
app.use('/api/activity-logs', authenticateToken, activityLogRoutes);

// Add chat routes
app.use('/api', chatRoutes);

// Auth routes
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);
app.post('/api/auth/google', AuthController.loginWithGoogle);

// Fallback: serve index.html for any non-API route (for React Router, local only)
if (!isVercel) {
    const publicDir = path.join(__dirname, '..', 'public');
    app.get('*', (req: Request, res: Response) => {
        if (req.path.startsWith('/api/')) return;
        res.sendFile(path.join(publicDir, 'index.html'));
    });
}

// Error handling middleware
app.use(errorHandler);

// Only start standalone HTTP server when not running in Vercel serverless environment
if (!isVercel) {
    console.log('[APP] Starting database initialization...');
    initializeDatabase()
        .then((success) => {
            if (success) {
                console.log('[APP] Database initialization successful!');

                const PORT = process.env.PORT || 3000;
                const server = app.listen(PORT, () => {
                    console.log(`[APP] Server is running on port ${PORT}`);
                    console.log(`[APP] API available at http://localhost:${PORT}/api`);
                });

                // Graceful shutdown
                const shutdown = () => {
                    console.log('[APP] Shutting down gracefully...');
                    server.close(async () => {
                        console.log('[APP] Server closed');
                        if (AppDataSource.isInitialized) {
                            await AppDataSource.destroy();
                            console.log('[APP] Database connection closed');
                        }
                        process.exit(0);
                    });
                };

                process.on('SIGTERM', shutdown);
                process.on('SIGINT', shutdown);

            } else {
                console.error('[APP] Database initialization failed. Exiting.');
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error('[APP] Critical error during database initialization:', error);
            process.exit(1);
        });
}

export default app;
