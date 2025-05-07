import { AppDataSource } from '../config/database';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';
import { TrainingExercise } from '../entities/TrainingExercise';
import { User } from '../entities/User';
import mockTrainings from '../data/mockTrainings.json';

const trainingRepository = AppDataSource.getRepository(Training);
const exerciseRepository = AppDataSource.getRepository(Exercise);
const trainingExerciseRepository = AppDataSource.getRepository(TrainingExercise);
const userRepository = AppDataSource.getRepository(User);

async function importTrainings() {
    try {
        // Initialize database connection
        await AppDataSource.initialize();
        console.log('Database connection initialized');

        // Get the first user (or specify a user ID)
        const user = await userRepository.findOne({ where: {} });
        if (!user) {
            throw new Error('No user found in the database');
        }

        console.log(`Importing trainings for user: ${user.id}`);

        // Process each training
        for (const trainingData of mockTrainings) {
            try {
                // Create new training
                const training = new Training();
                training.date = new Date(trainingData.date);
                training.userId = user.id;

                // Save training to get ID
                const savedTraining = await trainingRepository.save(training);
                console.log(`Created training for date: ${trainingData.date}`);

                // Process exercises
                for (const [exerciseName, weight] of Object.entries(trainingData.exercises)) {
                    // Find or create exercise
                    let exercise = await exerciseRepository.findOne({ where: { name: exerciseName } });
                    if (!exercise) {
                        exercise = new Exercise();
                        exercise.name = exerciseName;
                        exercise.muscleGroup = 'Other'; // Default muscle group
                        await exerciseRepository.save(exercise);
                        console.log(`Created new exercise: ${exerciseName}`);
                    }

                    // Create training exercise relationship
                    const trainingExercise = new TrainingExercise();
                    trainingExercise.training = savedTraining;
                    trainingExercise.exercise = exercise;
                    trainingExercise.weight = weight;
                    trainingExercise.trainingId = savedTraining.id;
                    trainingExercise.exerciseId = exercise.id;

                    await trainingExerciseRepository.save(trainingExercise);
                    console.log(`Added exercise ${exerciseName} with weight ${weight}kg`);
                }
            } catch (error) {
                console.error(`Error processing training for date ${trainingData.date}:`, error);
            }
        }

        console.log('Import completed successfully');
    } catch (error) {
        console.error('Error during import:', error);
    } finally {
        // Close database connection
        await AppDataSource.destroy();
        console.log('Database connection closed');
    }
}

// Run the import
importTrainings(); 