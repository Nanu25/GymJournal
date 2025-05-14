"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueExercises = exports.getTotalWeightPerSession = exports.getExerciseProgressData = exports.getMuscleGroupDistribution = exports.updateTrainingByDate = exports.deleteTraining = exports.createTraining = exports.getAllTrainings = void 0;
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
        const limit = parseInt(req.query.limit || '5', 10);
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
        const pageCount = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = formattedTrainings.slice(start, end);
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
        const existingTraining = await trainingRepository.findOne({ where: { date: new Date(date), userId: req.user.id } });
        if (existingTraining) {
            res.status(400).json({ message: 'Training for this date already exists' });
            return;
        }
        const training = new Training_1.Training();
        training.date = new Date(date);
        training.userId = req.user.id;
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
            entityId: savedTraining.id,
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
        if (training.trainingExercises && training.trainingExercises.length > 0) {
            await trainingExerciseRepository.remove(training.trainingExercises);
        }
        await trainingRepository.remove(training);
        await activityLogRepository.save({
            userId: req.user.id,
            action: ActivityLog_1.ActionType.DELETE,
            entityType: 'Training',
            entityId: training.id,
            details: { date: training.date, exercises: training.trainingExercises },
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
            entityId: training.id,
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
const getMuscleGroupDistribution = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const trainings = await trainingRepository.find({
            where: { userId: req.user.id },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
        const muscleGroupCounts = {};
        trainings.forEach((training) => {
            training.trainingExercises.forEach((te) => {
                const muscleGroup = te.exercise.muscleGroup || 'Other';
                muscleGroupCounts[muscleGroup] = (muscleGroupCounts[muscleGroup] || 0) + 1;
            });
        });
        res.status(200).json(muscleGroupCounts);
    }
    catch (error) {
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
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const trainings = await trainingRepository.find({
            where: { userId: req.user.id },
            relations: ['trainingExercises']
        });
        const totalWeightData = trainings.map((training) => {
            const totalWeight = training.trainingExercises.reduce((sum, te) => sum + te.weight, 0);
            const date = training.date instanceof Date
                ? training.date.toISOString().split('T')[0]
                : new Date(training.date).toISOString().split('T')[0];
            return {
                date,
                totalWeight: Number(totalWeight)
            };
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        res.status(200).json(totalWeightData);
    }
    catch (error) {
        console.error('Error getting total weight per session:', error);
        res.status(500).json({ message: 'Error getting total weight per session', error });
    }
};
exports.getTotalWeightPerSession = getTotalWeightPerSession;
const getUniqueExercises = async (req, res) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const trainings = await trainingRepository.find({
            where: { userId: req.user.id },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
        const uniqueExercises = new Set();
        trainings.forEach((training) => {
            training.trainingExercises.forEach((te) => {
                uniqueExercises.add(te.exercise.name);
            });
        });
        res.status(200).json(Array.from(uniqueExercises));
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting unique exercises', error });
    }
};
exports.getUniqueExercises = getUniqueExercises;
//# sourceMappingURL=TrainingController.js.map