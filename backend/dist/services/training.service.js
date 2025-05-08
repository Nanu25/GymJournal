"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingService = void 0;
const Training_1 = require("../entities/Training");
const database_1 = require("../config/database");
class TrainingService {
    constructor() {
        this.cache = new Map();
        this.CACHE_TTL = 60000;
        this.trainingRepository = database_1.AppDataSource.getRepository(Training_1.Training);
    }
    getCacheKey(key) {
        return `training:${key}`;
    }
    async getFromCache(key) {
        const cacheKey = this.getCacheKey(key);
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.data;
        }
        return null;
    }
    setCache(key, data) {
        const cacheKey = this.getCacheKey(key);
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }
    invalidateCache(key) {
        const cacheKey = this.getCacheKey(key);
        this.cache.delete(cacheKey);
    }
    async getUserTrainings(userId, startDate, endDate) {
        const cacheKey = `user:${userId}:${startDate === null || startDate === void 0 ? void 0 : startDate.toISOString()}:${endDate === null || endDate === void 0 ? void 0 : endDate.toISOString()}`;
        const cached = await this.getFromCache(cacheKey);
        if (cached)
            return cached;
        const query = this.trainingRepository
            .createQueryBuilder('training')
            .leftJoinAndSelect('training.trainingExercises', 'trainingExercise')
            .leftJoinAndSelect('trainingExercise.exercise', 'exercise')
            .where('training.userId = :userId', { userId });
        if (startDate) {
            query.andWhere('training.date >= :startDate', { startDate });
        }
        if (endDate) {
            query.andWhere('training.date <= :endDate', { endDate });
        }
        const trainings = await query.getMany();
        this.setCache(cacheKey, trainings);
        return trainings;
    }
    async getTrainingById(id) {
        const cached = await this.getFromCache(id);
        if (cached)
            return cached;
        const training = await this.trainingRepository.findOne({
            where: { id },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
        if (training) {
            this.setCache(id, training);
        }
        return training;
    }
    async createTraining(training) {
        const newTraining = await this.trainingRepository.save(training);
        this.invalidateCache(`user:${training.userId}`);
        return newTraining;
    }
    async updateTraining(id, updates) {
        const training = await this.trainingRepository.findOne({ where: { id } });
        if (!training)
            return null;
        Object.assign(training, updates);
        const updatedTraining = await this.trainingRepository.save(training);
        this.invalidateCache(id);
        this.invalidateCache(`user:${training.userId}`);
        return updatedTraining;
    }
    async deleteTraining(id) {
        const training = await this.trainingRepository.findOne({ where: { id } });
        if (!training)
            return false;
        await this.trainingRepository.delete(id);
        this.invalidateCache(id);
        this.invalidateCache(`user:${training.userId}`);
        return true;
    }
}
exports.TrainingService = TrainingService;
//# sourceMappingURL=training.service.js.map