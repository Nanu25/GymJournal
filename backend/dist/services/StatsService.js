"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const StatsRepository_1 = require("../repositories/StatsRepository");
class StatsService {
    static async getMuscleGroupDistribution(userId) {
        return await StatsRepository_1.StatsRepository.getMuscleGroupDistribution(userId);
    }
    static async getExerciseProgress(userId, exerciseName) {
        return await StatsRepository_1.StatsRepository.getExerciseProgress(userId, exerciseName);
    }
    static async getTotalWeightPerSession(userId) {
        return await StatsRepository_1.StatsRepository.getTotalWeightPerSession(userId);
    }
    static async getUniqueExercises(userId) {
        return await StatsRepository_1.StatsRepository.getUniqueExercises(userId);
    }
    static async getTrainingDates(userId) {
        return await StatsRepository_1.StatsRepository.getTrainingDates(userId);
    }
}
exports.StatsService = StatsService;
//# sourceMappingURL=StatsService.js.map