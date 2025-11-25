"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrainingByDate = exports.deleteTraining = exports.createTraining = exports.getAllTrainings = void 0;
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const database_1 = require("../config/database");
const typeorm_1 = require("typeorm");
const ActivityLog_1 = require("../entities/ActivityLog");
const muscleGroupMappingData_json_1 = __importDefault(require("../data/muscleGroupMappingData.json"));
const muscleGroupMappingData = muscleGroupMappingData_json_1.default;
const trainingRepository = database_1.AppDataSource.getRepository(Training_1.Training);
const exerciseRepository = database_1.AppDataSource.getRepository(Exercise_1.Exercise);
const trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
const activityLogRepository = database_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
const getAllTrainings = async (req, res) => {
    var _a;
    try {
        const { searchTerm, sortField, sortDirection } = req.query;
        const page = parseInt(req.query.page || '1', 10);
        const limitParam = req.query.limit;
        const parsedLimit = limitParam !== undefined ? parseInt(limitParam, 10) : 5;
        const limit = Number.isFinite(parsedLimit) && parsedLimit >= 0 ? parsedLimit : 5;
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const queryBuilder = database_1.AppDataSource
            .getRepository(Training_1.Training)
            .createQueryBuilder('training')
            .leftJoinAndSelect('training.trainingExercises', 'trainingExercise')
            .leftJoinAndSelect('trainingExercise.exercise', 'exercise')
            .where('training.userId = :userId', { userId: req.user.id });
        if (searchTerm) {
            const term = `%${searchTerm}%`;
            queryBuilder.andWhere('(CAST(training.date AS TEXT) LIKE :term OR exercise.name LIKE :term)', { term });
        }
        if (sortField === 'date') {
            queryBuilder.orderBy('training.date', sortDirection === 'asc' ? 'ASC' : 'DESC');
        }
        else {
            queryBuilder.orderBy('training.date', 'DESC');
        }
        const trainings = await queryBuilder.getMany();
        const formattedTrainings = trainings.map((training) => {
            const exercises = {};
            training.trainingExercises.forEach((te) => {
                exercises[te.exercise.name] = te.weight;
            });
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
        res.status(200).json({
            data: paginatedData,
            total,
            page,
            pageCount
        });
    }
    catch (error) {
        console.error('Error fetching trainings:', error);
        res.status(500).json({ message: 'Error fetching trainings' });
    }
};
exports.getAllTrainings = getAllTrainings;
const createTraining = async (req, res) => {
    var _a;
    try {
        console.log('Creating training with request body:', JSON.stringify(req.body));
        const { date, exercises } = req.body;
        if (!date) {
            console.error('Missing date in request');
            res.status(400).json({ message: 'Date is required' });
            return;
        }
        if (!exercises || Object.keys(exercises).length === 0) {
            console.error('Missing exercises in request');
            res.status(400).json({ message: 'At least one exercise is required' });
            return;
        }
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            console.error('No user ID found in request');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        console.log(`Creating training for user ${req.user.id} on date ${date} with ${Object.keys(exercises).length} exercises`);
        if (!database_1.AppDataSource.isInitialized) {
            console.error('Database is not initialized when creating training');
            res.status(503).json({ message: 'Database service unavailable, please try again later' });
            return;
        }
        try {
            console.log(`Checking for existing training on ${date} for user ID: ${req.user.id} (type: ${typeof req.user.id})`);
            const userId = req.user.id;
            const existingTraining = await trainingRepository.findOne({ where: { date: new Date(date), userId } });
            if (existingTraining) {
                res.status(400).json({ message: 'Training for this date already exists' });
                return;
            }
        }
        catch (dbError) {
            console.error('Error checking for existing training:', dbError);
            res.status(500).json({ message: 'Error checking for existing training' });
            return;
        }
        const training = new Training_1.Training();
        training.date = new Date(date);
        training.userId = req.user.id;
        const exercisesRecord = {};
        for (const [key, value] of Object.entries(exercises)) {
            if (!isNaN(Number(value)) && Number(value) > 0) {
                exercisesRecord[key] = Number(value);
            }
        }
        training.exercises = exercisesRecord;
        console.log(`Creating training with userId: ${training.userId} (type: ${typeof training.userId})`);
        console.log(`Exercises data: ${JSON.stringify(training.exercises)}`);
        const savedTraining = await trainingRepository.save(training);
        const trainingExercises = [];
        for (const [exerciseName, weight] of Object.entries(exercises)) {
            if (isNaN(Number(weight)) || Number(weight) <= 0) {
                console.warn(`Invalid weight for exercise ${exerciseName}: ${weight}`);
                continue;
            }
            let exercise = await exerciseRepository.findOne({ where: { name: exerciseName } });
            if (!exercise) {
                exercise = new Exercise_1.Exercise();
                exercise.name = exerciseName;
                exercise.muscleGroup = muscleGroupMappingData[exerciseName] || 'Other';
                await exerciseRepository.save(exercise);
            }
            const trainingExercise = new TrainingExercise_1.TrainingExercise();
            trainingExercise.training = savedTraining;
            trainingExercise.exercise = exercise;
            trainingExercise.weight = Number(weight);
            trainingExercise.trainingId = savedTraining.id;
            trainingExercise.exerciseId = exercise.id;
            trainingExercises.push(trainingExercise);
        }
        if (trainingExercises.length === 0) {
            console.error('No valid exercises to save');
            await trainingRepository.remove(savedTraining);
            res.status(400).json({ message: 'No valid exercises provided' });
            return;
        }
        await trainingExerciseRepository.save(trainingExercises);
        await activityLogRepository.save({
            userId: req.user.id,
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
        res.status(201).json({
            id: savedTraining.id,
            date: savedTraining.date.toISOString().split('T')[0],
            exercises: formattedExercises
        });
    }
    catch (error) {
        console.error('Detailed error creating training:', error);
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
        }
        res.status(500).json({
            message: 'Error creating training',
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error instanceof Error ? error.stack : undefined
        });
    }
};
exports.createTraining = createTraining;
const deleteTraining = async (req, res) => {
    try {
        const { date } = req.params;
        const trainingDate = new Date(date);
        const training = await trainingRepository.findOne({
            where: {
                date: (0, typeorm_1.Between)(new Date(trainingDate.setHours(0, 0, 0, 0)), new Date(trainingDate.setHours(23, 59, 59, 999)))
            },
            relations: ['trainingExercises']
        });
        if (!training) {
            res.status(404).json({ message: 'Training not found' });
            return;
        }
        const trainingId = String(training.id);
        if (training.trainingExercises.length > 0) {
            await trainingExerciseRepository.remove(training.trainingExercises);
        }
        await trainingRepository.remove(training);
        await activityLogRepository.save({
            userId: req.user.id,
            action: ActivityLog_1.ActionType.DELETE,
            entityType: 'Training',
            entityId: trainingId,
            details: { date },
            timestamp: new Date(),
        });
        res.status(200).json({ message: 'Training deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting training:', error);
        res.status(500).json({ message: 'Error deleting training', error });
    }
};
exports.deleteTraining = deleteTraining;
const updateTrainingByDate = async (req, res) => {
    var _a;
    try {
        console.log('Update request received:', { params: req.params, body: req.body });
        const { date } = req.params;
        const { exercises } = req.body;
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            console.log('No user ID found in request');
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        console.log('Finding training for date range:', { startDate, endDate });
        const training = await trainingRepository.findOne({
            where: {
                date: (0, typeorm_1.Between)(startDate, endDate),
                userId: req.user.id
            },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
        if (!training) {
            console.log('Training not found for date:', date);
            res.status(404).json({ message: 'Training not found' });
            return;
        }
        console.log('Found training:', training);
        if (training.trainingExercises && training.trainingExercises.length > 0) {
            console.log('Deleting existing training exercises:', training.trainingExercises);
            await trainingExerciseRepository.remove(training.trainingExercises);
        }
        const trainingExercises = [];
        for (const [exerciseName, weight] of Object.entries(exercises)) {
            if (isNaN(Number(weight)) || Number(weight) <= 0) {
                console.log('Skipping invalid weight for exercise:', { exerciseName, weight });
                continue;
            }
            let exercise = await exerciseRepository.findOne({ where: { name: exerciseName } });
            if (!exercise) {
                console.log('Creating new exercise:', exerciseName);
                exercise = new Exercise_1.Exercise();
                exercise.name = exerciseName;
                exercise.muscleGroup = muscleGroupMappingData[exerciseName] || 'Other';
                await exerciseRepository.save(exercise);
            }
            const trainingExercise = new TrainingExercise_1.TrainingExercise();
            trainingExercise.training = training;
            trainingExercise.exercise = exercise;
            trainingExercise.weight = Number(weight);
            trainingExercise.trainingId = training.id;
            trainingExercise.exerciseId = exercise.id;
            trainingExercises.push(trainingExercise);
        }
        if (trainingExercises.length === 0) {
            console.log('No valid exercises to save');
            res.status(400).json({ message: 'No valid exercises provided' });
            return;
        }
        console.log('Saving new training exercises:', trainingExercises);
        await trainingExerciseRepository.save(trainingExercises);
        await activityLogRepository.save({
            userId: req.user.id,
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
        const response = {
            id: training.id,
            date: dateObj.toISOString().split('T')[0],
            exercises: formattedExercises
        };
        console.log('Sending response:', response);
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error updating training:', error);
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
        }
        res.status(500).json({
            message: 'Error updating training',
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error instanceof Error ? error.stack : undefined
        });
    }
};
exports.updateTrainingByDate = updateTrainingByDate;
//# sourceMappingURL=TrainingController.js.map