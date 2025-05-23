import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { User } from '../entities/User';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';
import { TrainingExercise } from '../entities/TrainingExercise';
import { ActivityLog } from '../entities/ActivityLog';
import { MonitoredUser } from '../entities/MonitoredUser';

console.log('[DB_CONFIG] Starting database configuration...');

const getDatabaseConfig = (): DataSourceOptions => {
    console.log('[DB_CONFIG] Entering getDatabaseConfig()');
    if (process.env.DATABASE_URL) {
        console.log('[DB_CONFIG] DATABASE_URL found. Parsing...');
        try {
            const url = new URL(process.env.DATABASE_URL);
            console.log(`[DB_CONFIG] Connecting to PostgreSQL at ${url.hostname}:${url.port}/${url.pathname.substring(1)}`);
            
            // Supabase optimized configuration
            return {
                type: 'postgres',
                host: url.hostname,
                port: parseInt(url.port),
                username: url.username,
                password: url.password,
                database: url.pathname.substring(1),
                ssl: {
                    rejectUnauthorized: false // Required for Supabase
                },
                // Supabase free tier optimized settings
                poolSize: 5,
                connectTimeoutMS: 5000,
                extra: {
                    max: 5,
                    idleTimeoutMillis: 15000,
                    connectionTimeoutMillis: 5000,
                    statement_timeout: 15000,
                    // Supabase specific optimizations
                    application_name: 'gym-journal-app',
                    // Enable prepared statements
                    prepare: true,
                    // Enable statement caching
                    statement_cache_size: 100
                }
            };
        } catch (error) {
            console.error('[DB_CONFIG] ERROR parsing DATABASE_URL:', error);
            throw error;
        }
    }
    
    console.log('[DB_CONFIG] DATABASE_URL not found, using local development database configuration');
    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'alexinfo',
        database: process.env.DB_NAME || 'fitness_journal'
    };
};

console.log('[DB_CONFIG] Database configuration function defined. Preparing to create DataSource.');
let appDataSourceInstance: DataSource;

try {
    console.log('[DB_CONFIG] Defining entities for DataSource...');
    const entities = [User, Training, Exercise, TrainingExercise, ActivityLog, MonitoredUser];
    console.log('[DB_CONFIG] Entities defined. Number of entities:', entities.length);
    entities.forEach(entity => console.log('[DB_CONFIG] Entity:', entity.name));

    const dbConfig = getDatabaseConfig();
    console.log('[DB_CONFIG] Resolved database configuration:', JSON.stringify(dbConfig, (key, value) => key === 'password' ? '[REDACTED]' : value));

    appDataSourceInstance = new DataSource({
        ...dbConfig,
        logging: process.env.NODE_ENV !== 'production', // Only log in development
        logger: "advanced-console",
        entities: entities,
        subscribers: [],
        cache: {
            duration: 60000 // Cache query results for 1 minute
        },
        // Add safer synchronization options
        synchronize: false, // Disable automatic synchronization
        migrationsRun: true, // Run migrations automatically
        migrationsTableName: "migrations", // Name of the migrations table
        migrations: ["src/migrations/*.ts"], // Path to migrations
        // Note: extra is already included in dbConfig, don't duplicate it here
    });
    console.log('[DB_CONFIG] DataSource instance created successfully.');
} catch (error) {
    console.error('[DB_CONFIG] CRITICAL ERROR during DataSource instantiation:', error);
    process.exit(1); // Exit to make it clear this is a fatal startup error
}

// Create and export the data source
export const AppDataSource = appDataSourceInstance; 

// Add a wrapper function to help with debugging and connection retries
export const initializeDatabase = async () => {
    console.log('[DB_INIT] Starting database initialization...');
    const MAX_RETRIES = 5;
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
        try {
            if (retries > 0) {
                console.log(`[DB_INIT] Retry attempt ${retries} of ${MAX_RETRIES}`);
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
            }
            
            console.time('[DB_INIT] Database connection time');
            // If AppDataSource is already initialized, destroy it first
            if (AppDataSource.isInitialized) {
                console.log('[DB_INIT] DataSource already initialized, destroying first');
                await AppDataSource.destroy();
            }
            
            await AppDataSource.initialize();
            console.timeEnd('[DB_INIT] Database connection time');
            console.log('[DB_INIT] Database connection successful!');
            
            // Test a simple query to verify it's really working
            console.time('[DB_INIT] Test query time');
            const userCount = await AppDataSource.getRepository(User).count();
            console.timeEnd('[DB_INIT] Test query time');
            console.log(`[DB_INIT] Database test query complete. Found ${userCount} users.`);
            
            return true;
        } catch (error) {
            console.error(`[DB_INIT] Error during database initialization (attempt ${retries+1}/${MAX_RETRIES}):`, error);
            retries++;
            
            if (retries >= MAX_RETRIES) {
                console.error('[DB_INIT] All retry attempts failed. Could not connect to database.');
                return false;
            }
        }
    }
    
    return false;
}; 
