"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
async function initializeDatabase() {
    try {
        await database_1.AppDataSource.initialize();
        console.log('Database connection established');
        await database_1.AppDataSource.synchronize(true);
        console.log('Database schema has been synchronized');
        console.log('Database initialization completed successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1);
    }
}
initializeDatabase();
//# sourceMappingURL=initializeDatabase.js.map