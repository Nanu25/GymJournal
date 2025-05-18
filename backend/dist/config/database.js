"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const ActivityLog_1 = require("../entities/ActivityLog");
const MonitoredUser_1 = require("../entities/MonitoredUser");
console.log('[DB_CONFIG] Starting database configuration...');
const getDatabaseConfig = () => {
    console.log('[DB_CONFIG] Entering getDatabaseConfig()');
    if (process.env.DATABASE_URL) {
        console.log('[DB_CONFIG] DATABASE_URL found. Parsing...');
        try {
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
                    rejectUnauthorized: false
                },
                poolSize: 20,
                connectTimeoutMS: 10000,
                extra: {
                    max: 20,
                    idleTimeoutMillis: 30000,
                    connectionTimeoutMillis: 10000,
                    statement_timeout: 25000
                }
            };
        }
        catch (error) {
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
let appDataSourceInstance;
try {
    console.log('[DB_CONFIG] Defining entities for DataSource...');
    const entities = [User_1.User, Training_1.Training, Exercise_1.Exercise, TrainingExercise_1.TrainingExercise, ActivityLog_1.ActivityLog, MonitoredUser_1.MonitoredUser];
    console.log('[DB_CONFIG] Entities defined. Number of entities:', entities.length);
    entities.forEach(entity => console.log('[DB_CONFIG] Entity:', entity.name));
    const dbConfig = getDatabaseConfig();
    console.log('[DB_CONFIG] Resolved database configuration:', JSON.stringify(dbConfig, (key, value) => key === 'password' ? '[REDACTED]' : value));
    appDataSourceInstance = new typeorm_1.DataSource({
        ...dbConfig,
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
        logger: "advanced-console",
        entities: entities,
        subscribers: [],
        migrations: [],
        cache: {
            duration: 60000
        }
    });
    console.log('[DB_CONFIG] DataSource instance created successfully.');
}
catch (error) {
    console.error('[DB_CONFIG] CRITICAL ERROR during DataSource instantiation:', error);
    process.exit(1);
}
exports.AppDataSource = appDataSourceInstance;
const initializeDatabase = async () => {
    console.log('[DB_INIT] Starting database initialization...');
    const MAX_RETRIES = 5;
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            if (retries > 0) {
                console.log(`[DB_INIT] Retry attempt ${retries} of ${MAX_RETRIES}`);
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
            }
            console.time('[DB_INIT] Database connection time');
            if (exports.AppDataSource.isInitialized) {
                console.log('[DB_INIT] DataSource already initialized, destroying first');
                await exports.AppDataSource.destroy();
            }
            await exports.AppDataSource.initialize();
            console.timeEnd('[DB_INIT] Database connection time');
            console.log('[DB_INIT] Database connection successful!');
            console.time('[DB_INIT] Test query time');
            const userCount = await exports.AppDataSource.getRepository(User_1.User).count();
            console.timeEnd('[DB_INIT] Test query time');
            console.log(`[DB_INIT] Database test query complete. Found ${userCount} users.`);
            return true;
        }
        catch (error) {
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
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=database.js.map