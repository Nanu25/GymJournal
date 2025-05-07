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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function restoreData() {
    try {
        await database_1.AppDataSource.initialize();
        console.log('Database connection established');
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const trainingRepository = database_1.AppDataSource.getRepository(Training_1.Training);
        const exerciseRepository = database_1.AppDataSource.getRepository(Exercise_1.Exercise);
        const trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
        console.log('\nCreating user...');
        const user = new User_1.User();
        user.name = 'alex';
        user.email = 'alex@gmail.com';
        user.password = 'aaaa';
        const savedUser = await userRepository.save(user);
        console.log('User created:', savedUser);
        const mockDataPath = path.join(__dirname, '..', '..', 'mockTrainings.json');
        const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
        console.log('\nCreating exercises...');
        const exerciseMap = new Map();
        for (const training of mockData) {
            for (const exercise of training.exercises) {
                if (!exerciseMap.has(exercise.name)) {
                    const newExercise = new Exercise_1.Exercise();
                    newExercise.name = exercise.name;
                    newExercise.muscleGroup = exercise.muscleGroup;
                    const savedExercise = await exerciseRepository.save(newExercise);
                    exerciseMap.set(exercise.name, savedExercise);
                    console.log(`Created exercise: ${exercise.name}`);
                }
            }
        }
        console.log('\nCreating trainings...');
        for (const trainingData of mockData) {
            const training = new Training_1.Training();
            training.date = new Date(trainingData.date);
            training.userId = savedUser.id;
            const savedTraining = await trainingRepository.save(training);
            console.log(`Created training for date: ${trainingData.date}`);
            for (const exerciseData of trainingData.exercises) {
                const exercise = exerciseMap.get(exerciseData.name);
                if (exercise) {
                    const trainingExercise = new TrainingExercise_1.TrainingExercise();
                    trainingExercise.training = savedTraining;
                    trainingExercise.exercise = exercise;
                    trainingExercise.weight = exerciseData.weight;
                    trainingExercise.trainingId = savedTraining.id;
                    trainingExercise.exerciseId = exercise.id;
                    await trainingExerciseRepository.save(trainingExercise);
                    console.log(`Added exercise ${exerciseData.name} to training`);
                }
            }
        }
        console.log('\nData restoration completed successfully!');
    }
    catch (error) {
        console.error('Error during data restoration:', error);
    }
    finally {
        await database_1.AppDataSource.destroy();
        console.log('\nDatabase connection closed');
    }
}
restoreData();
//# sourceMappingURL=restoreData.js.map