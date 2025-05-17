import { AppDataSource } from '../config/database';

async function initializeDatabase() {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Force synchronize to create tables based on entities
    // WARNING: This is not recommended for production, but useful for initial setup
    await AppDataSource.synchronize(true);
    console.log('Database schema has been synchronized');

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 