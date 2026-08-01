import { TrainingRepository, TrainingFilterOptions } from '../repositories/TrainingRepository';
import { ExerciseRepository } from '../repositories/ExerciseRepository';
import { AppDataSource } from '../config/database';
import { Training } from '../entities/Training';
import { TrainingExercise } from '../entities/TrainingExercise';
import { ActivityLog, ActionType } from '../entities/ActivityLog';

interface FormattedTraining {
    date: string;
    exercises: { [key: string]: number };
}

export class TrainingService {
    static async getAllTrainings(options: TrainingFilterOptions) {
        const { sortField, sortDirection, page = 1, limit = 5 } = options;

        const trainings = await TrainingRepository.findAllWithFilters(options);

        // Transform data to match frontend expectations
        const formattedTrainings: FormattedTraining[] = trainings.map((training: Training) => {
            const exercises: { [key: string]: number } = {};

            if (training.trainingExercises) {
                training.trainingExercises.forEach((te: TrainingExercise) => {
                    exercises[te.exercise.name] = te.weight;
                });
            }

            // Ensure date is properly formatted
            const date = training.date instanceof Date
                ? training.date.toISOString().split('T')[0]
                : new Date(training.date).toISOString().split('T')[0];

            return {
                date,
                exercises
            };
        });

        // Apply additional sorting that requires the transformed data
        if (sortField === 'pr') {
            formattedTrainings.sort((a: FormattedTraining, b: FormattedTraining) => {
                const prA = Object.values(a.exercises).length > 0 ? Math.max(...Object.values(a.exercises).map(Number)) : 0;
                const prB = Object.values(b.exercises).length > 0 ? Math.max(...Object.values(b.exercises).map(Number)) : 0;
                return sortDirection === 'asc' ? prA - prB : prB - prA;
            });
        } else if (sortField === 'exercises') {
            formattedTrainings.sort((a: FormattedTraining, b: FormattedTraining) => {
                const comparison = Object.keys(a.exercises).length - Object.keys(b.exercises).length;
                return sortDirection === 'asc' ? comparison : -comparison;
            });
        }

        const total = formattedTrainings.length;
        let pageCount: number;
        let paginatedData: FormattedTraining[];

        if (limit === 0) {
            pageCount = total > 0 ? 1 : 0;
            paginatedData = formattedTrainings;
        } else {
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

    static async createTraining(userId: string, date: string, exercises: { [key: string]: number | string }) {
        if (!AppDataSource.isInitialized) {
            throw new Error('Database service unavailable');
        }

        // Check if training already exists
        const existingTraining = await TrainingRepository.findByDate(new Date(date), userId);
        if (existingTraining) {
            throw new Error('Training for this date already exists');
        }

        // Create new training
        const training = new Training();
        training.date = new Date(date);
        training.userId = userId;

        // Store exercises directly in the exercises column as well
        const exercisesRecord: Record<string, number> = {};
        for (const [key, value] of Object.entries(exercises)) {
            if (!isNaN(Number(value)) && Number(value) > 0) {
                exercisesRecord[key] = Number(value);
            }
        }
        training.exercises = exercisesRecord;

        // Save training first to get ID
        const savedTraining = await TrainingRepository.save(training);

        // Process exercises for TrainingExercise relationships
        const trainingExercises: TrainingExercise[] = [];
        const trainingExerciseRepository = AppDataSource.getRepository(TrainingExercise);

        for (const [exerciseName, weight] of Object.entries(exercises)) {
            if (isNaN(Number(weight)) || Number(weight) <= 0) {
                continue;
            }

            // Find or create exercise
            const exercise = await ExerciseRepository.findByNameOrCreate(exerciseName);

            // Create training exercise relationship
            const trainingExercise = new TrainingExercise();
            trainingExercise.training = savedTraining;
            trainingExercise.exercise = exercise;
            trainingExercise.weight = Number(weight);
            trainingExercise.trainingId = savedTraining.id;
            trainingExercise.exerciseId = exercise.id;

            trainingExercises.push(trainingExercise);
        }

        if (trainingExercises.length === 0) {
            // Clean up the training if no exercises were valid
            await TrainingRepository.remove(savedTraining);
            throw new Error('No valid exercises provided');
        }

        await trainingExerciseRepository.save(trainingExercises);

        // Log activity
        const activityLogRepository = AppDataSource.getRepository(ActivityLog);
        await activityLogRepository.save({
            userId: userId,
            action: ActionType.CREATE,
            entityType: 'Training',
            entityId: String(savedTraining.id),
            details: { date, exercises },
            timestamp: new Date(),
        });

        // Return formatted response
        const formattedExercises: { [key: string]: number } = {};
        trainingExercises.forEach(te => {
            formattedExercises[te.exercise.name] = te.weight;
        });

        return {
            id: savedTraining.id,
            date: savedTraining.date.toISOString().split('T')[0],
            exercises: formattedExercises
        };
    }

    static async updateTraining(userId: string, date: string, exercises: { [key: string]: number | string }, newDate?: string) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const training = await TrainingRepository.findByDateRange(startDate, endDate, userId);

        if (!training) {
            throw new Error('Training not found');
        }

        // Handle date update if newDate is provided and different
        if (newDate && newDate !== date) {
            const newDateObj = new Date(newDate);
            // Check if a training already exists for the new date
            const existingTraining = await TrainingRepository.findByDate(newDateObj, userId);
            if (existingTraining) {
                throw new Error('A training session already exists for the new date');
            }
            training.date = newDateObj;
            await TrainingRepository.save(training);
        }

        const trainingExerciseRepository = AppDataSource.getRepository(TrainingExercise);

        if (training.trainingExercises && training.trainingExercises.length > 0) {
            await trainingExerciseRepository.remove(training.trainingExercises);
        }

        const trainingExercises: TrainingExercise[] = [];
        for (const [exerciseName, weight] of Object.entries(exercises)) {
            if (isNaN(Number(weight)) || Number(weight) <= 0) {
                continue;
            }

            const exercise = await ExerciseRepository.findByNameOrCreate(exerciseName);

            const trainingExercise = new TrainingExercise();
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

        // Log activity
        const activityLogRepository = AppDataSource.getRepository(ActivityLog);
        await activityLogRepository.save({
            userId: userId,
            action: ActionType.UPDATE,
            entityType: 'Training',
            entityId: String(training.id),
            details: { date: newDate || date, exercises },
            timestamp: new Date(),
        });

        const formattedExercises: { [key: string]: number } = {};
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

    static async deleteTraining(userId: string, date: string) {
        const trainingDate = new Date(date);
        const startDate = new Date(trainingDate.setHours(0, 0, 0, 0));
        const endDate = new Date(trainingDate.setHours(23, 59, 59, 999));

        const training = await TrainingRepository.findByDateRange(startDate, endDate, userId);

        if (!training) {
            throw new Error('Training not found');
        }

        const trainingId = String(training.id);
        const trainingExerciseRepository = AppDataSource.getRepository(TrainingExercise);

        if (training.trainingExercises && training.trainingExercises.length > 0) {
            await trainingExerciseRepository.remove(training.trainingExercises);
        }

        await TrainingRepository.remove(training);

        // Log activity
        const activityLogRepository = AppDataSource.getRepository(ActivityLog);
        await activityLogRepository.save({
            userId: userId,
            action: ActionType.DELETE,
            entityType: 'Training',
            entityId: trainingId,
            details: { date },
            timestamp: new Date(),
        });
    }
}
