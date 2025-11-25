"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueExercises = exports.getTotalWeightPerSession = exports.getExerciseProgressData = exports.getMuscleGroupDistribution = void 0;
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const database_1 = require("../config/database");
const trainingRepository = database_1.AppDataSource.getRepository(Training_1.Training);
const getMuscleGroupDistribution = async (req, res) => {
    var _a;
    try {
        console.log('[CONTROLLER] getMuscleGroupDistribution called');
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            console.log('[CONTROLLER] getMuscleGroupDistribution: No user ID found');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        console.log('[CONTROLLER] getMuscleGroupDistribution: Starting query for user', req.user.id);
        console.time('[CONTROLLER] muscleGroupQuery');
        const result = await database_1.AppDataSource
            .createQueryBuilder()
            .select('e.muscleGroup', 'muscleGroup')
            .addSelect('COUNT(te.id)', 'count')
            .from(Training_1.Training, 't')
            .innerJoin('t.trainingExercises', 'te')
            .innerJoin('te.exercise', 'e')
            .where('t.userId = :userId', { userId: req.user.id })
            .groupBy('e.muscleGroup')
            .getRawMany();
        console.timeEnd('[CONTROLLER] muscleGroupQuery');
        console.log('[CONTROLLER] getMuscleGroupDistribution: Query returned', result.length, 'groups');
        const muscleGroupCounts = {};
        result.forEach(item => {
            muscleGroupCounts[item.muscleGroup || 'Other'] = parseInt(item.count, 10);
        });
        console.log('[CONTROLLER] getMuscleGroupDistribution: Sending response');
        res.status(200).json(muscleGroupCounts);
    }
    catch (error) {
        console.error('[CONTROLLER] Error in getMuscleGroupDistribution:', error);
        res.status(500).json({ message: 'Error getting muscle group distribution', error });
    }
};
exports.getMuscleGroupDistribution = getMuscleGroupDistribution;
const getExerciseProgressData = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const { exercise } = req.params;
        const trainings = await trainingRepository.find({
            where: { userId: req.user.id },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
        const progressData = trainings
            .filter((training) => training.trainingExercises.some((te) => te.exercise.name === exercise))
            .map((training) => {
            const exerciseData = training.trainingExercises.find((te) => te.exercise.name === exercise);
            const date = training.date instanceof Date
                ? training.date.toISOString().split('T')[0]
                : new Date(training.date).toISOString().split('T')[0];
            return {
                date,
                weight: Number((exerciseData === null || exerciseData === void 0 ? void 0 : exerciseData.weight) || 0)
            };
        })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        res.status(200).json(progressData);
    }
    catch (error) {
        console.error('Error getting exercise progress data:', error);
        res.status(500).json({ message: 'Error getting exercise progress data', error });
    }
};
exports.getExerciseProgressData = getExerciseProgressData;
const getTotalWeightPerSession = async (req, res) => {
    var _a;
    try {
        console.log('[CONTROLLER] getTotalWeightPerSession called');
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            console.log('[CONTROLLER] getTotalWeightPerSession: No user ID found');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        console.log('[CONTROLLER] getTotalWeightPerSession: Starting query for user', req.user.id);
        console.time('[CONTROLLER] totalWeightQuery');
        const result = await database_1.AppDataSource
            .createQueryBuilder()
            .select('t.date', 'date')
            .addSelect('SUM(te.weight)', 'totalWeight')
            .from(Training_1.Training, 't')
            .innerJoin('t.trainingExercises', 'te')
            .where('t.userId = :userId', { userId: req.user.id })
            .groupBy('t.date')
            .orderBy('t.date', 'ASC')
            .getRawMany();
        console.timeEnd('[CONTROLLER] totalWeightQuery');
        console.log('[CONTROLLER] getTotalWeightPerSession: Query returned', result.length, 'sessions');
        const totalWeightData = result.map(item => {
            const date = new Date(item.date).toISOString().split('T')[0];
            return {
                date,
                totalWeight: Number(item.totalWeight)
            };
        });
        console.log('[CONTROLLER] getTotalWeightPerSession: Sending response');
        res.status(200).json(totalWeightData);
    }
    catch (error) {
        console.error('[CONTROLLER] Error in getTotalWeightPerSession:', error);
        res.status(500).json({ message: 'Error getting total weight per session', error });
    }
};
exports.getTotalWeightPerSession = getTotalWeightPerSession;
const getUniqueExercises = async (req, res) => {
    var _a;
    try {
        console.log('[CONTROLLER] getUniqueExercises called');
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            console.log('[CONTROLLER] getUniqueExercises: No user ID found');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        console.log('[CONTROLLER] getUniqueExercises: Starting query for user', req.user.id);
        console.time('[CONTROLLER] uniqueExercisesQuery');
        const result = await database_1.AppDataSource
            .createQueryBuilder()
            .select('DISTINCT e.name', 'name')
            .from(Exercise_1.Exercise, 'e')
            .innerJoin('e.trainingExercises', 'te')
            .innerJoin('te.training', 't')
            .where('t.userId = :userId', { userId: req.user.id })
            .orderBy('e.name', 'ASC')
            .getRawMany();
        console.timeEnd('[CONTROLLER] uniqueExercisesQuery');
        console.log('[CONTROLLER] getUniqueExercises: Query returned', result.length, 'exercises');
        const uniqueExercises = result.map(item => item.name);
        console.log('[CONTROLLER] getUniqueExercises: Sending response');
        res.status(200).json(uniqueExercises);
    }
    catch (error) {
        console.error('[CONTROLLER] Error in getUniqueExercises:', error);
        res.status(500).json({ message: 'Error getting unique exercises', error });
    }
};
exports.getUniqueExercises = getUniqueExercises;
//# sourceMappingURL=StatsController.js.map