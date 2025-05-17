import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { User } from '../entities/User';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';
import { TrainingExercise } from '../entities/TrainingExercise';
import { ActivityLog } from '../entities/ActivityLog';
import { MonitoredUser } from '../entities/MonitoredUser';

console.log('[DB_CONFIG] Starting database configuration...');

// Parse the DATABASE_URL from Heroku
const getDatabaseConfig = (): DataSourceOptions => {
    console.log('[DB_CONFIG] Entering getDatabaseConfig()');
    if (process.env.DATABASE_URL) {
        console.log('[DB_CONFIG] DATABASE_URL found. Parsing...');
        // Heroku provides a DATABASE_URL in the format:
        // postgres://username:password@host:port/database
        const url = new URL(process.env.DATABASE_URL);
        console.log(`[DB_CONFIG] Connecting to PostgreSQL at ${url.hostname}:${url.port}/${url.pathname.substring(1)} with SSL`);
        return {
            type: 'postgres',
            host: url.hostname,
            port: parseInt(url.port),
            username: url.username,
            password: url.password,
            database: url.pathname.substring(1),
            ssl: {
                rejectUnauthorized: false // Required for Heroku
            }
        };
    }
    
    console.log('[DB_CONFIG] DATABASE_URL not found, using local development database configuration');
    // Fallback to local development configuration
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
        synchronize: process.env.NODE_ENV !== 'production', // Only true in development
        logging: process.env.NODE_ENV !== 'production', // Consider setting to true for Heroku debugging temporarily
        entities: entities,
        subscribers: [],
        migrations: [],
    });
    console.log('[DB_CONFIG] DataSource instance created successfully.');
} catch (error) {
    console.error('[DB_CONFIG] CRITICAL ERROR during DataSource instantiation:', error);
    // If an error occurs here, it's before AppDataSource.initialize() is even called
    // This could be the source of the H10 if it crashes the process
    process.exit(1); // Exit to make it clear this is a fatal startup error
}

// Create and export the data source
export const AppDataSource = appDataSourceInstance; 
