import { AppDataSource } from '../config/database';

async function syncDatabase() {
    try {
        // Initialize the database connection
        await AppDataSource.initialize();
        console.log('Database connection established');

        // Force synchronize to create tables based on entities
        await AppDataSource.synchronize(true);
        console.log('Database schema has been synchronized');

        console.log('Database synchronization completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error during database synchronization:', error);
        process.exit(1);
    }
}

syncDatabase(); 