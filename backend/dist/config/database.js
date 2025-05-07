"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'alexinfo',
    database: process.env.DB_NAME || 'fitness_journal',
    synchronize: true,
    logging: true,
    entities: [User_1.User, Training_1.Training, Exercise_1.Exercise, TrainingExercise_1.TrainingExercise],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=database.js.map