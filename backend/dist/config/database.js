"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const ActivityLog_1 = require("../entities/ActivityLog");

// Debug all environment variables
console.log('Environment Variables Check:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
if (process.env.DATABASE_URL) {
    console.log(`DATABASE_URL starts with: ${process.env.DATABASE_URL.substring(0, 20)}...`);
}

const getDatabaseConfig = () => {
    if (process.env.DATABASE_URL) {
        try {
            // Heroku provides a DATABASE_URL in the format:
            // postgres://username:password@host:port/database
            const url = new URL(process.env.DATABASE_URL);
            console.log(`Connecting to PostgreSQL at ${url.hostname}:${url.port}/${url.pathname.substring(1)} with SSL`);
            
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
        } catch (error) {
            console.error('Error parsing DATABASE_URL:', error);
        }
    }
    
    // Fallback to local development configuration
    console.warn('DATABASE_URL not found or invalid, using local development database configuration');
    console.warn('THIS IS LIKELY TO FAIL ON HEROKU! Add a PostgreSQL database with: heroku addons:create heroku-postgresql:mini');
    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'alexinfo',
        database: process.env.DB_NAME || 'fitness_journal'
    };
};

const config = getDatabaseConfig();
console.log(`Database connection: ${JSON.stringify({
    type: config.type,
    host: config.host,
    port: config.port,
    database: config.database,
    ssl: !!config.ssl
})}`);

exports.AppDataSource = new typeorm_1.DataSource({
    ...config,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV !== 'production',
    entities: [User_1.User, Training_1.Training, Exercise_1.Exercise, TrainingExercise_1.TrainingExercise, ActivityLog_1.ActivityLog],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=database.js.map