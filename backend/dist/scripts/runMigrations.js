"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
async function runMigrations() {
    try {
        console.log('Initializing database connection...');
        await database_1.AppDataSource.initialize();
        console.log('Database connection established');
        console.log('Running pending migrations...');
        const migrations = await database_1.AppDataSource.runMigrations();
        if (migrations.length === 0) {
            console.log('No pending migrations to run.');
        }
        else {
            console.log(`Successfully ran ${migrations.length} migration(s):`);
            migrations.forEach(migration => {
                console.log(`  - ${migration.name}`);
            });
        }
        console.log('Migrations completed successfully');
        if (database_1.AppDataSource.isInitialized) {
            await database_1.AppDataSource.destroy();
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Error running migrations:', error);
        if (database_1.AppDataSource.isInitialized) {
            await database_1.AppDataSource.destroy();
        }
        process.exit(1);
    }
}
runMigrations();
//# sourceMappingURL=runMigrations.js.map