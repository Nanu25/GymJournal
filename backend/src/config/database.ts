import 'reflect-metadata';
import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { User } from '../entities/User';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';
import { TrainingExercise } from '../entities/TrainingExercise';
import { ActivityLog } from '../entities/ActivityLog';
import { MonitoredUser } from '../entities/MonitoredUser';

// Load environment variables from .env in local development
if (!process.env.VERCEL) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('dotenv').config();
    } catch (_) {
        // dotenv may not be available in production
    }
}

const isVercel = !!process.env.VERCEL;

// Parse the DATABASE_URL
const getDatabaseConfig = (): DataSourceOptions => {
    if (process.env.DATABASE_URL) {
        try {
            const url = new URL(process.env.DATABASE_URL);
            const port = url.port ? parseInt(url.port, 10) : 5432;
            console.log(`[DB_CONFIG] Connecting to PostgreSQL at ${url.hostname}:${port}/${url.pathname.substring(1)}`);

            // Use smaller pool for serverless to avoid exhausting Supabase connections
            const poolSize = isVercel ? 3 : 20;

            return {
                type: 'postgres',
                host: url.hostname,
                port: port,
                username: decodeURIComponent(url.username),
                password: decodeURIComponent(url.password),
                database: url.pathname.substring(1) || 'postgres',
                ssl: {
                    rejectUnauthorized: process.env.PG_SSL_REJECT_UNAUTHORIZED === 'true'
                },
                extra: {
                    max: poolSize,
                    idleTimeoutMillis: isVercel ? 10000 : 30000,
                    connectionTimeoutMillis: 10000
                }
            };
        } catch (error) {
            console.error('[DB_CONFIG] ERROR parsing DATABASE_URL:', error);
            throw error;
        }
    }

    console.log('[DB_CONFIG] DATABASE_URL not found, using local development database configuration');
    // Fallback to local development configuration
    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD, // No default password for security
        database: process.env.DB_NAME || 'fitness_journal'
    };
};

const entities = [User, Training, Exercise, TrainingExercise, ActivityLog, MonitoredUser];

let appDataSourceInstance: DataSource;

try {
    const dbConfig = getDatabaseConfig();

    appDataSourceInstance = new DataSource({
        ...dbConfig,
        synchronize: false,
        logging: !isVercel && process.env.NODE_ENV !== 'production',
        logger: "advanced-console",
        entities: entities,
        subscribers: [],
        migrations: [],
        migrationsTableName: 'migrations',
    });
    console.log('[DB_CONFIG] DataSource instance created successfully.');
} catch (error) {
    console.error('[DB_CONFIG] CRITICAL ERROR during DataSource instantiation:', error);
    // Create a dummy DataSource so the module can still export.
    // initializeDatabase() will fail gracefully at request time.
    appDataSourceInstance = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '',
        database: 'postgres',
        entities: entities,
    });
}

// Create and export the data source
export const AppDataSource = appDataSourceInstance;

// Add a wrapper function to help with debugging and connection retries
export const initializeDatabase = async () => {
    console.log('[DB_INIT] Starting database initialization...');
    // Fewer retries on Vercel to avoid function timeout
    const MAX_RETRIES = isVercel ? 2 : 5;
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            if (retries > 0) {
                console.log(`[DB_INIT] Retry attempt ${retries} of ${MAX_RETRIES}`);
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
            }

            // If AppDataSource is already initialized, skip
            if (AppDataSource.isInitialized) {
                console.log('[DB_INIT] DataSource already initialized, reusing.');
                return true;
            }

            await AppDataSource.initialize();
            console.log('[DB_INIT] Database connection successful!');

            return true;
        } catch (error) {
            console.error(`[DB_INIT] Error during database initialization (attempt ${retries + 1}/${MAX_RETRIES}):`, error);
            retries++;

            if (retries >= MAX_RETRIES) {
                console.error('[DB_INIT] All retry attempts failed. Could not connect to database.');
                return false;
            }
        }
    }

    return false;
};
