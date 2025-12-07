import { AppDataSource } from '../config/database';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';

export const StatsRepository = AppDataSource.getRepository(Training).extend({
    async getMuscleGroupDistribution(userId: string) {
        const result = await this.createQueryBuilder('t')
            .select('e.muscleGroup', 'muscleGroup')
            .addSelect('COUNT(te.id)', 'count')
            .innerJoin('t.trainingExercises', 'te')
            .innerJoin('te.exercise', 'e')
            .where('t.userId = :userId', { userId })
            .groupBy('e.muscleGroup')
            .getRawMany();

        const muscleGroupCounts: { [key: string]: number } = {};
        result.forEach((item: any) => {
            muscleGroupCounts[item.muscleGroup || 'Other'] = parseInt(item.count, 10);
        });

        return muscleGroupCounts;
    },

    async getExerciseProgress(userId: string, exerciseName: string) {
        // Optimized query: Filter by exercise name in the database instead of memory
        const result = await this.createQueryBuilder('t')
            .select('t.date', 'date')
            .addSelect('te.weight', 'weight')
            .innerJoin('t.trainingExercises', 'te')
            .innerJoin('te.exercise', 'e')
            .where('t.userId = :userId', { userId })
            .andWhere('e.name = :exerciseName', { exerciseName })
            .orderBy('t.date', 'ASC')
            .getRawMany();

        return result.map((item: any) => ({
            date: new Date(item.date).toISOString().split('T')[0],
            weight: Number(item.weight)
        }));
    },

    async getTotalWeightPerSession(userId: string) {
        const result = await this.createQueryBuilder('t')
            .select('t.date', 'date')
            .addSelect('SUM(te.weight)', 'totalWeight')
            .innerJoin('t.trainingExercises', 'te')
            .where('t.userId = :userId', { userId })
            .groupBy('t.date')
            .orderBy('t.date', 'ASC')
            .getRawMany();

        return result.map((item: any) => ({
            date: new Date(item.date).toISOString().split('T')[0],
            totalWeight: Number(item.totalWeight)
        }));
    },

    async getUniqueExercises(userId: string) {
        const result = await AppDataSource.getRepository(Exercise)
            .createQueryBuilder('e')
            .select('DISTINCT e.name', 'name')
            .innerJoin('e.trainingExercises', 'te')
            .innerJoin('te.training', 't')
            .where('t.userId = :userId', { userId })
            .orderBy('e.name', 'ASC')
            .getRawMany();

        return result.map((item: any) => item.name);
    },

    async getTrainingDates(userId: string) {
        const result = await this.createQueryBuilder('t')
            .select('t.date', 'date')
            .where('t.userId = :userId', { userId })
            .orderBy('t.date', 'ASC')
            .getRawMany();

        return result.map((item: any) => new Date(item.date).toISOString().split('T')[0]);
    },

    async getRecentMuscleGroups(userId: string) {
        // Calculate the date 48 hours ago
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const dateString = twoDaysAgo.toISOString().split('T')[0];

        const result = await this.createQueryBuilder('t')
            .select('DISTINCT e.muscleGroup', 'muscleGroup')
            .innerJoin('t.trainingExercises', 'te')
            .innerJoin('te.exercise', 'e')
            .where('t.userId = :userId', { userId })
            .andWhere('t.date >= :dateString', { dateString })
            .getRawMany();

        return result.map((item: any) => item.muscleGroup);
    }
});
