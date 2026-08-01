"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRepository = void 0;
const database_1 = require("../config/database");
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
exports.StatsRepository = database_1.AppDataSource.getRepository(Training_1.Training).extend({
    async getMuscleGroupDistribution(userId) {
        const result = await this.createQueryBuilder('t')
            .select('e.muscleGroup', 'muscleGroup')
            .addSelect('COUNT(te.id)', 'count')
            .innerJoin('t.trainingExercises', 'te')
            .innerJoin('te.exercise', 'e')
            .where('t.userId = :userId', { userId })
            .groupBy('e.muscleGroup')
            .getRawMany();
        const muscleGroupCounts = {};
        result.forEach(item => {
            muscleGroupCounts[item.muscleGroup || 'Other'] = parseInt(item.count, 10);
        });
        return muscleGroupCounts;
    },
    async getExerciseProgress(userId, exerciseName) {
        const result = await this.createQueryBuilder('t')
            .select('t.date', 'date')
            .addSelect('te.weight', 'weight')
            .innerJoin('t.trainingExercises', 'te')
            .innerJoin('te.exercise', 'e')
            .where('t.userId = :userId', { userId })
            .andWhere('e.name = :exerciseName', { exerciseName })
            .orderBy('t.date', 'ASC')
            .getRawMany();
        return result.map(item => ({
            date: new Date(item.date).toISOString().split('T')[0],
            weight: Number(item.weight)
        }));
    },
    async getTotalWeightPerSession(userId) {
        const result = await this.createQueryBuilder('t')
            .select('t.date', 'date')
            .addSelect('SUM(te.weight)', 'totalWeight')
            .innerJoin('t.trainingExercises', 'te')
            .where('t.userId = :userId', { userId })
            .groupBy('t.date')
            .orderBy('t.date', 'ASC')
            .getRawMany();
        return result.map(item => ({
            date: new Date(item.date).toISOString().split('T')[0],
            totalWeight: Number(item.totalWeight)
        }));
    },
    async getUniqueExercises(userId) {
        const result = await database_1.AppDataSource.getRepository(Exercise_1.Exercise)
            .createQueryBuilder('e')
            .select('DISTINCT e.name', 'name')
            .innerJoin('e.trainingExercises', 'te')
            .innerJoin('te.training', 't')
            .where('t.userId = :userId', { userId })
            .orderBy('e.name', 'ASC')
            .getRawMany();
        return result.map(item => item.name);
    },
    async getTrainingDates(userId) {
        const result = await this.createQueryBuilder('t')
            .select('t.date', 'date')
            .where('t.userId = :userId', { userId })
            .orderBy('t.date', 'ASC')
            .getRawMany();
        return result.map(item => new Date(item.date).toISOString().split('T')[0]);
    }
});
//# sourceMappingURL=StatsRepository.js.map