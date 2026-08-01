import { AppDataSource } from '../config/database';

async function runMigrations() {
    try {
        console.log('Initializing database connection...');
        await AppDataSource.initialize();
        console.log('Database connection established');

        console.log('Running pending migrations...');
        const migrations = await AppDataSource.runMigrations();
        
        if (migrations.length === 0) {
            console.log('No pending migrations to run.');
        } else {
            console.log(`Successfully ran ${migrations.length} migration(s):`);
            migrations.forEach(migration => {
                console.log(`  - ${migration.name}`);
            });
        }

        console.log('Migrations completed successfully');
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        process.exit(0);
    } catch (error) {
        console.error('Error running migrations:', error);
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        process.exit(1);
    }
}

runMigrations();
