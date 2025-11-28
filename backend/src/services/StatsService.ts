import { StatsRepository } from '../repositories/StatsRepository';

export class StatsService {
    static async getMuscleGroupDistribution(userId: string) {
        return await StatsRepository.getMuscleGroupDistribution(userId);
    }

    static async getExerciseProgress(userId: string, exerciseName: string) {
        return await StatsRepository.getExerciseProgress(userId, exerciseName);
    }

    static async getTotalWeightPerSession(userId: string) {
        return await StatsRepository.getTotalWeightPerSession(userId);
    }

    static async getUniqueExercises(userId: string) {
        return await StatsRepository.getUniqueExercises(userId);
    }

    static async getTrainingDates(userId: string) {
        return await StatsRepository.getTrainingDates(userId);
    }
}
