"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const User_1 = require("../entities/User");
const mockTrainings_json_1 = __importDefault(require("../data/mockTrainings.json"));
const muscleGroupMappingData_json_1 = __importDefault(require("../data/muscleGroupMappingData.json"));
const muscleGroupMappingData = muscleGroupMappingData_json_1.default;
const trainingRepository = database_1.AppDataSource.getRepository(Training_1.Training);
const exerciseRepository = database_1.AppDataSource.getRepository(Exercise_1.Exercise);
const trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
async function importTrainings() {
    try {
        await database_1.AppDataSource.initialize();
        console.log('Database connection initialized');
        const user = await userRepository.findOne({ where: { email: 'alex@gmail.com' } });
        if (!user) {
            throw new Error('No user found in the database');
        }
        console.log(`Importing trainings for user: ${user.id}`);
        for (const trainingData of mockTrainings_json_1.default) {
            try {
                const training = new Training_1.Training();
                training.date = new Date(trainingData.date);
                training.userId = user.id;
                const savedTraining = await trainingRepository.save(training);
                console.log(`Created training for date: ${trainingData.date}`);
                for (const [exerciseName, weight] of Object.entries(trainingData.exercises)) {
                    let exercise = await exerciseRepository.findOne({ where: { name: exerciseName } });
                    if (!exercise) {
                        exercise = new Exercise_1.Exercise();
                        exercise.name = exerciseName;
                        exercise.muscleGroup = muscleGroupMappingData[exerciseName] || 'Other';
                        await exerciseRepository.save(exercise);
                        console.log(`Created new exercise: ${exerciseName}`);
                    }
                    const trainingExercise = new TrainingExercise_1.TrainingExercise();
                    trainingExercise.training = savedTraining;
                    trainingExercise.exercise = exercise;
                    trainingExercise.weight = weight;
                    trainingExercise.trainingId = savedTraining.id;
                    trainingExercise.exerciseId = exercise.id;
                    await trainingExerciseRepository.save(trainingExercise);
                    console.log(`Added exercise ${exerciseName} with weight ${weight}kg`);
                }
            }
            catch (error) {
                console.error(`Error processing training for date ${trainingData.date}:`, error);
            }
        }
        console.log('Import completed successfully');
    }
    catch (error) {
        console.error('Error during import:', error);
    }
    finally {
        await database_1.AppDataSource.destroy();
        console.log('Database connection closed');
    }
}
importTrainings();
//# sourceMappingURL=importTrainings.js.map