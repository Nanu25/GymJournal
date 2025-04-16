import { DataSource } from 'typeorm';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'alexinfo',
    database: process.env.DB_NAME || 'fitness_journal',
    synchronize: true, // Set to false in production
    logging: true,
    entities: [User],
    subscribers: [],
    migrations: [],
}); 