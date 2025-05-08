"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingService = void 0;
const typeorm_1 = require("typeorm");
const Training_1 = require("../entities/Training");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const Exercise_1 = require("../entities/Exercise");
const database_1 = require("../config/database");
class TrainingService {
    constructor() {
        this.trainingRepository = database_1.AppDataSource.getRepository(Training_1.Training);
        this.trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
        this.exerciseRepository = database_1.AppDataSource.getRepository(Exercise_1.Exercise);
    }
    async getTrainingsByUserId(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [trainings, total] = await this.trainingRepository.findAndCount({
            where: { userId },
            order: { date: 'DESC' },
            skip,
            take: limit,
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
        return {
            trainings,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getTrainingById(id) {
        return this.trainingRepository.findOne({
            where: { id },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
    }
    async createTraining(trainingData) {
        const training = this.trainingRepository.create(trainingData);
        return this.trainingRepository.save(training);
    }
    async updateTraining(id, trainingData) {
        await this.trainingRepository.update(id, trainingData);
        return this.getTrainingById(id);
    }
    async deleteTraining(id) {
        return this.trainingRepository.delete(id);
    }
    async getExercisesByMuscleGroup(muscleGroup) {
        return this.exerciseRepository.find({
            where: { muscleGroup },
            order: { name: 'ASC' }
        });
    }
    async addExerciseToTraining(trainingId, exerciseId, weight) {
        const trainingExercise = this.trainingExerciseRepository.create({
            trainingId,
            exerciseId,
            weight
        });
        return this.trainingExerciseRepository.save(trainingExercise);
    }
    async removeExerciseFromTraining(trainingId, exerciseId) {
        return this.trainingExerciseRepository.delete({
            trainingId,
            exerciseId
        });
    }
    async getTrainingHistory(userId, startDate, endDate) {
        return this.trainingRepository.find({
            where: {
                userId,
                date: (0, typeorm_1.Between)(startDate, endDate)
            },
            order: { date: 'DESC' },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
    }
    async getExerciseProgress(userId, exerciseId, limit = 10) {
        return this.trainingExerciseRepository.find({
            where: {
                exerciseId,
                training: { userId }
            },
            order: { training: { date: 'DESC' } },
            relations: ['training'],
            take: limit
        });
    }
}
exports.TrainingService = TrainingService;
//# sourceMappingURL=TrainingService.js.map