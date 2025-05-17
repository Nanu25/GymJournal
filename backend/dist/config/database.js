"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const ActivityLog_1 = require("../entities/ActivityLog");
console.log('[DB_CONFIG] Starting database configuration...');
const getDatabaseConfig = () => {
    console.log('[DB_CONFIG] Entering getDatabaseConfig()');
    if (process.env.DATABASE_URL) {
        console.log('[DB_CONFIG] DATABASE_URL found. Parsing...');
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
            }
        };
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
    const entities = [User_1.User, Training_1.Training, Exercise_1.Exercise, TrainingExercise_1.TrainingExercise, ActivityLog_1.ActivityLog];
    console.log('[DB_CONFIG] Entities defined. Number of entities:', entities.length);
    entities.forEach(entity => console.log('[DB_CONFIG] Entity:', entity.name));
    const dbConfig = getDatabaseConfig();
    console.log('[DB_CONFIG] Resolved database configuration:', JSON.stringify(dbConfig, (key, value) => key === 'password' ? '[REDACTED]' : value));
    appDataSourceInstance = new typeorm_1.DataSource({
        ...dbConfig,
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
        entities: entities,
        subscribers: [],
        migrations: [],
    });
    console.log('[DB_CONFIG] DataSource instance created successfully.');
}
catch (error) {
    console.error('[DB_CONFIG] CRITICAL ERROR during DataSource instantiation:', error);
    process.exit(1);
}
exports.AppDataSource = appDataSourceInstance;
//# sourceMappingURL=database.js.map