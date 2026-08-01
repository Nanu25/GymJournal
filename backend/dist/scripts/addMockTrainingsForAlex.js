"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
async function main() {
    console.log('Initializing database connection...');
    await database_1.AppDataSource.initialize();
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    const trainingRepo = database_1.AppDataSource.getRepository(Training_1.Training);
    const exerciseRepo = database_1.AppDataSource.getRepository(Exercise_1.Exercise);
    const trainingExerciseRepo = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
    console.log('Finding or creating user Alex...');
    let alex = await userRepo.findOne({ where: { name: 'Alex' } });
    if (!alex) {
        console.log('User Alex not found. Creating new user...');
        alex = new User_1.User();
        alex.name = 'Alex';
        alex.email = 'alex@example.com';
        alex.weight = 75;
        alex.password = 'password123';
        alex = await userRepo.save(alex);
        console.log(`Created new user with ID: ${alex.id}`);
    }
    else {
        console.log(`Found existing user Alex with ID: ${alex.id}`);
    }
    console.log('Loading mock trainings data...');
    const dataPath = path.join(__dirname, '../data/mockTrainings.json');
    const mockTrainings = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Found ${mockTrainings.length} mock trainings to import`);
    let addedTrainings = 0;
    let skippedTrainings = 0;
    for (const mockTraining of mockTrainings) {
        const existingTraining = await trainingRepo.findOne({
            where: {
                userId: alex.id,
                date: new Date(mockTraining.date)
            }
        });
        if (existingTraining) {
            console.log(`Training for date ${mockTraining.date} already exists. Skipping...`);
            skippedTrainings++;
            continue;
        }
        console.log(`Adding training for date ${mockTraining.date}`);
        const training = new Training_1.Training();
        training.date = new Date(mockTraining.date);
        training.userId = alex.id;
        training.exercises = mockTraining.exercises;
        const savedTraining = await trainingRepo.save(training);
        const trainingExercises = [];
        for (const [exerciseName, weight] of Object.entries(mockTraining.exercises)) {
            let exercise = await exerciseRepo.findOne({ where: { name: exerciseName } });
            if (!exercise) {
                console.log(`Exercise ${exerciseName} not found. Creating...`);
                exercise = new Exercise_1.Exercise();
                exercise.name = exerciseName;
                exercise.muscleGroup = 'Other';
                await exerciseRepo.save(exercise);
            }
            const trainingExercise = new TrainingExercise_1.TrainingExercise();
            trainingExercise.trainingId = savedTraining.id;
            trainingExercise.exerciseId = exercise.id;
            trainingExercise.training = savedTraining;
            trainingExercise.exercise = exercise;
            trainingExercise.weight = weight;
            trainingExercises.push(trainingExercise);
        }
        await trainingExerciseRepo.save(trainingExercises);
        addedTrainings++;
        console.log(`Added training for date ${mockTraining.date} with ${Object.keys(mockTraining.exercises).length} exercises`);
    }
    console.log(`Done! Added: ${addedTrainings}, Skipped (already existed): ${skippedTrainings}`);
    await database_1.AppDataSource.destroy();
}
main().catch(err => {
    console.error('Error adding mock trainings:', err);
    process.exit(1);
});
//# sourceMappingURL=addMockTrainingsForAlex.js.map