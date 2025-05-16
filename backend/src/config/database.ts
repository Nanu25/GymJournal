import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { User } from '../entities/User';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';
import { TrainingExercise } from '../entities/TrainingExercise';
import { ActivityLog } from '../entities/ActivityLog';

// Parse the DATABASE_URL from Heroku
const getDatabaseConfig = (): DataSourceOptions => {
    if (process.env.DATABASE_URL) {
        // Heroku provides a DATABASE_URL in the format:
        // postgres://username:password@host:port/database
        const url = new URL(process.env.DATABASE_URL);
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

export const AppDataSource = new DataSource({
    ...getDatabaseConfig(),
    synchronize: process.env.NODE_ENV !== 'production', // Only true in development
    logging: process.env.NODE_ENV !== 'production',
    entities: [User, Training, Exercise, TrainingExercise, ActivityLog],
    subscribers: [],
    migrations: [],
}); 