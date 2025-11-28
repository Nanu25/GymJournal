"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingService = void 0;
const TrainingRepository_1 = require("../repositories/TrainingRepository");
const ExerciseRepository_1 = require("../repositories/ExerciseRepository");
const database_1 = require("../config/database");
const Training_1 = require("../entities/Training");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const ActivityLog_1 = require("../entities/ActivityLog");
class TrainingService {
    static async getAllTrainings(options) {
        const { sortField, sortDirection, page = 1, limit = 5 } = options;
        const trainings = await TrainingRepository_1.TrainingRepository.findAllWithFilters(options);
        const formattedTrainings = trainings.map((training) => {
            const exercises = {};
            if (training.trainingExercises) {
                training.trainingExercises.forEach((te) => {
                    exercises[te.exercise.name] = te.weight;
                });
            }
            const date = training.date instanceof Date
                ? training.date.toISOString().split('T')[0]
                : new Date(training.date).toISOString().split('T')[0];
            return {
                date,
                exercises
            };
        });
        if (sortField === 'pr') {
            formattedTrainings.sort((a, b) => {
                const prA = Object.values(a.exercises).length > 0 ? Math.max(...Object.values(a.exercises).map(Number)) : 0;
                const prB = Object.values(b.exercises).length > 0 ? Math.max(...Object.values(b.exercises).map(Number)) : 0;
                return sortDirection === 'asc' ? prA - prB : prB - prA;
            });
        }
        else if (sortField === 'exercises') {
            formattedTrainings.sort((a, b) => {
                const comparison = Object.keys(a.exercises).length - Object.keys(b.exercises).length;
                return sortDirection === 'asc' ? comparison : -comparison;
            });
        }
        const total = formattedTrainings.length;
        let pageCount;
        let paginatedData;
        if (limit === 0) {
            pageCount = total > 0 ? 1 : 0;
            paginatedData = formattedTrainings;
        }
        else {
            const safeLimit = Math.max(1, limit);
            pageCount = Math.ceil(total / safeLimit);
            const start = (page - 1) * safeLimit;
            const end = start + safeLimit;
            paginatedData = formattedTrainings.slice(start, end);
        }
        return {
            data: paginatedData,
            total,
            page,
            pageCount
        };
    }
    static async createTraining(userId, date, exercises) {
        if (!database_1.AppDataSource.isInitialized) {
            throw new Error('Database service unavailable');
        }
        const existingTraining = await TrainingRepository_1.TrainingRepository.findByDate(new Date(date), userId);
        if (existingTraining) {
            throw new Error('Training for this date already exists');
        }
        const training = new Training_1.Training();
        training.date = new Date(date);
        training.userId = userId;
        const exercisesRecord = {};
        for (const [key, value] of Object.entries(exercises)) {
            if (!isNaN(Number(value)) && Number(value) > 0) {
                exercisesRecord[key] = Number(value);
            }
        }
        training.exercises = exercisesRecord;
        const savedTraining = await TrainingRepository_1.TrainingRepository.save(training);
        const trainingExercises = [];
        const trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
        for (const [exerciseName, weight] of Object.entries(exercises)) {
            if (isNaN(Number(weight)) || Number(weight) <= 0) {
                continue;
            }
            const exercise = await ExerciseRepository_1.ExerciseRepository.findByNameOrCreate(exerciseName);
            const trainingExercise = new TrainingExercise_1.TrainingExercise();
            trainingExercise.training = savedTraining;
            trainingExercise.exercise = exercise;
            trainingExercise.weight = Number(weight);
            trainingExercise.trainingId = savedTraining.id;
            trainingExercise.exerciseId = exercise.id;
            trainingExercises.push(trainingExercise);
        }
        if (trainingExercises.length === 0) {
            await TrainingRepository_1.TrainingRepository.remove(savedTraining);
            throw new Error('No valid exercises provided');
        }
        await trainingExerciseRepository.save(trainingExercises);
        const activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
        await activityLogRepository.save({
            userId: userId,
            action: ActivityLog_1.ActionType.CREATE,
            entityType: 'Training',
            entityId: String(savedTraining.id),
            details: { date, exercises },
            timestamp: new Date(),
        });
        const formattedExercises = {};
        trainingExercises.forEach(te => {
            formattedExercises[te.exercise.name] = te.weight;
        });
        return {
            id: savedTraining.id,
            date: savedTraining.date.toISOString().split('T')[0],
            exercises: formattedExercises
        };
    }
    static async updateTraining(userId, date, exercises) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        const training = await TrainingRepository_1.TrainingRepository.findByDateRange(startDate, endDate, userId);
        if (!training) {
            throw new Error('Training not found');
        }
        const trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
        if (training.trainingExercises && training.trainingExercises.length > 0) {
            await trainingExerciseRepository.remove(training.trainingExercises);
        }
        const trainingExercises = [];
        for (const [exerciseName, weight] of Object.entries(exercises)) {
            if (isNaN(Number(weight)) || Number(weight) <= 0) {
                continue;
            }
            const exercise = await ExerciseRepository_1.ExerciseRepository.findByNameOrCreate(exerciseName);
            const trainingExercise = new TrainingExercise_1.TrainingExercise();
            trainingExercise.training = training;
            trainingExercise.exercise = exercise;
            trainingExercise.weight = Number(weight);
            trainingExercise.trainingId = training.id;
            trainingExercise.exerciseId = exercise.id;
            trainingExercises.push(trainingExercise);
        }
        if (trainingExercises.length === 0) {
            throw new Error('No valid exercises provided');
        }
        await trainingExerciseRepository.save(trainingExercises);
        const activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
        await activityLogRepository.save({
            userId: userId,
            action: ActivityLog_1.ActionType.UPDATE,
            entityType: 'Training',
            entityId: String(training.id),
            details: { date, exercises },
            timestamp: new Date(),
        });
        const formattedExercises = {};
        trainingExercises.forEach(te => {
            formattedExercises[te.exercise.name] = te.weight;
        });
        const dateObj = training.date instanceof Date ? training.date : new Date(training.date);
        return {
            id: training.id,
            date: dateObj.toISOString().split('T')[0],
            exercises: formattedExercises
        };
    }
    static async deleteTraining(userId, date) {
        const trainingDate = new Date(date);
        const startDate = new Date(trainingDate.setHours(0, 0, 0, 0));
        const endDate = new Date(trainingDate.setHours(23, 59, 59, 999));
        const training = await TrainingRepository_1.TrainingRepository.findByDateRange(startDate, endDate, userId);
        if (!training) {
            throw new Error('Training not found');
        }
        const trainingId = String(training.id);
        const trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
        if (training.trainingExercises && training.trainingExercises.length > 0) {
            await trainingExerciseRepository.remove(training.trainingExercises);
        }
        await TrainingRepository_1.TrainingRepository.remove(training);
        const activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
        await activityLogRepository.save({
            userId: userId,
            action: ActivityLog_1.ActionType.DELETE,
            entityType: 'Training',
            entityId: trainingId,
            details: { date },
            timestamp: new Date(),
        });
    }
}
exports.TrainingService = TrainingService;
//# sourceMappingURL=TrainingService.js.map