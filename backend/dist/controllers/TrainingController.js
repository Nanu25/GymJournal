"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueExercises = exports.getTotalWeightPerSession = exports.getExerciseProgressData = exports.getMuscleGroupDistribution = exports.updateTrainingByDate = exports.deleteTraining = exports.createTraining = exports.getAllTrainings = void 0;
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const database_1 = require("../config/database");
const typeorm_1 = require("typeorm");
const trainingRepository = database_1.AppDataSource.getRepository(Training_1.Training);
const exerciseRepository = database_1.AppDataSource.getRepository(Exercise_1.Exercise);
const trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
const getAllTrainings = async (req, res) => {
    try {
        const { searchTerm, sortField, sortDirection } = req.query;
        // Create query builder
        const queryBuilder = database_1.AppDataSource
            .getRepository(Training_1.Training)
            .createQueryBuilder('training')
            .leftJoinAndSelect('training.trainingExercises', 'trainingExercise')
            .leftJoinAndSelect('trainingExercise.exercise', 'exercise');
        // Apply filter if searchTerm exists
        if (searchTerm) {
            const term = `%${searchTerm}%`;
            queryBuilder.where('training.date LIKE :term', { term })
                .orWhere('exercise.name LIKE :term', { term });
        }
        // Apply sorting
        if (sortField === 'date') {
            queryBuilder.orderBy('training.date', sortDirection === 'asc' ? 'ASC' : 'DESC');
        }
        const trainings = await queryBuilder.getMany();
        // Transform data to match frontend expectations
        const formattedTrainings = trainings.map((training) => {
            const exercises = {};
            training.trainingExercises.forEach((te) => {
                exercises[te.exercise.name] = te.weight;
            });
            return {
                date: training.date.toISOString().split('T')[0],
                exercises
            };
        });
        // Apply additional sorting that requires the transformed data
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
        res.status(200).json(formattedTrainings);
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
        console.log('Request body:', req.body);
        console.log('User:', req.user);
        const { date, exercises } = req.body;
        // Validate required fields
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
        // Create new training
        const training = new Training_1.Training();
        training.date = new Date(date);
        training.userId = req.user.id;
        console.log('Creating training with data:', {
            date: training.date,
            userId: training.userId
        });
        // Save training first to get ID
        const savedTraining = await trainingRepository.save(training);
        console.log('Saved training:', savedTraining);
        // Process exercises
        const trainingExercises = [];
        for (const [exerciseName, weight] of Object.entries(exercises)) {
            console.log('Processing exercise:', { exerciseName, weight });
            if (isNaN(Number(weight)) || Number(weight) <= 0) {
                console.warn(`Invalid weight for exercise ${exerciseName}: ${weight}`);
                continue;
            }
            // Find or create exercise
            let exercise = await exerciseRepository.findOne({ where: { name: exerciseName } });
            if (!exercise) {
                console.log(`Creating new exercise: ${exerciseName}`);
                exercise = new Exercise_1.Exercise();
                exercise.name = exerciseName;
                exercise.muscleGroup = 'Other'; // Default muscle group
                await exerciseRepository.save(exercise);
            }
            // Create training exercise relationship
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
            // Clean up the training if no exercises were valid
            await trainingRepository.remove(savedTraining);
            res.status(400).json({ message: 'No valid exercises provided' });
            return;
        }
        // Save all training exercises
        console.log('Saving training exercises:', trainingExercises);
        await trainingExerciseRepository.save(trainingExercises);
        // Return formatted response
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
            }
        });
        if (!training) {
            res.status(404).json({ message: 'Training not found' });
            return;
        }
        await trainingRepository.remove(training);
        res.status(200).json({ message: 'Training deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting training', error });
    }
};
exports.deleteTraining = deleteTraining;
const updateTrainingByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const trainingDate = new Date(date);
        const training = await trainingRepository.findOne({
            where: {
                date: (0, typeorm_1.Between)(new Date(trainingDate.setHours(0, 0, 0, 0)), new Date(trainingDate.setHours(23, 59, 59, 999)))
            }
        });
        if (!training) {
            res.status(404).json({ message: 'Training not found' });
            return;
        }
        Object.assign(training, req.body);
        const updatedTraining = await trainingRepository.save(training);
        res.status(200).json(updatedTraining);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating training', error });
    }
};
exports.updateTrainingByDate = updateTrainingByDate;
const getMuscleGroupDistribution = async (req, res) => {
    try {
        const trainings = await trainingRepository.find({
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
    try {
        const { exercise } = req.params;
        const trainings = await trainingRepository.find({
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
        const progressData = trainings
            .filter((training) => training.trainingExercises.some((te) => te.exercise.name === exercise))
            .map((training) => {
            const exerciseData = training.trainingExercises.find((te) => te.exercise.name === exercise);
            return {
                date: training.date.toISOString().split('T')[0],
                weight: (exerciseData === null || exerciseData === void 0 ? void 0 : exerciseData.weight) || 0
            };
        });
        res.status(200).json(progressData);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting exercise progress data', error });
    }
};
exports.getExerciseProgressData = getExerciseProgressData;
const getTotalWeightPerSession = async (req, res) => {
    try {
        const trainings = await trainingRepository.find({
            relations: ['trainingExercises']
        });
        const totalWeightData = trainings.map((training) => ({
            date: training.date.toISOString().split('T')[0],
            totalWeight: training.trainingExercises.reduce((sum, te) => sum + te.weight, 0)
        }));
        res.status(200).json(totalWeightData);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting total weight per session', error });
    }
};
exports.getTotalWeightPerSession = getTotalWeightPerSession;
const getUniqueExercises = async (req, res) => {
    try {
        const trainings = await trainingRepository.find({
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
