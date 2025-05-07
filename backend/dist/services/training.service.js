"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingService = void 0;
const database_1 = require("../config/database");
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const trainingRepository = database_1.AppDataSource.getRepository(Training_1.Training);
const exerciseRepository = database_1.AppDataSource.getRepository(Exercise_1.Exercise);
const trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
class TrainingService {
    static async createTraining(userId, date, exercises) {
        const training = trainingRepository.create({
            date,
            user: { id: userId }
        });
        await trainingRepository.save(training);
        for (const exerciseData of exercises) {
            let exercise = await exerciseRepository.findOne({ where: { name: exerciseData.name } });
            if (!exercise) {
                exercise = exerciseRepository.create({ name: exerciseData.name });
                await exerciseRepository.save(exercise);
            }
            const trainingExercise = trainingExerciseRepository.create({
                training,
                exercise,
                value: exerciseData.value
            });
            await trainingExerciseRepository.save(trainingExercise);
        }
        return training;
    }
    static async getTrainings(userId) {
        return await trainingRepository.find({
            where: { user: { id: userId } },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
    }
    static async getTrainingById(userId, trainingId) {
        return await trainingRepository.findOne({
            where: { id: trainingId, user: { id: userId } },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
    }
}
exports.TrainingService = TrainingService;
