import { AppDataSource } from '../config/database';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';
import { TrainingExercise } from '../entities/TrainingExercise';
import { User } from '../entities/User';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const trainingRepository = AppDataSource.getRepository(Training);
const exerciseRepository = AppDataSource.getRepository(Exercise);
const trainingExerciseRepository = AppDataSource.getRepository(TrainingExercise);
const userRepository = AppDataSource.getRepository(User);

// Predefined list of exercises with their muscle groups
const exercises = [
    { name: 'Bench Press', muscleGroup: 'Chest' },
    { name: 'Squats', muscleGroup: 'Legs' },
    { name: 'Deadlift', muscleGroup: 'Back' },
    { name: 'Pull-ups', muscleGroup: 'Back' },
    { name: 'Push-ups', muscleGroup: 'Chest' },
    { name: 'Dumbbell Press', muscleGroup: 'Shoulders' },
    { name: 'Leg Press', muscleGroup: 'Legs' },
    { name: 'Bicep Curls', muscleGroup: 'Arms' },
    { name: 'Tricep Pushdowns', muscleGroup: 'Arms' },
    { name: 'Lunges', muscleGroup: 'Legs' },
    { name: 'Shoulder Press', muscleGroup: 'Shoulders' },
    { name: 'Lat Pulldowns', muscleGroup: 'Back' },
    { name: 'Calf Raises', muscleGroup: 'Legs' },
    { name: 'Plank', muscleGroup: 'Core' },
    { name: 'Russian Twists', muscleGroup: 'Core' }
];

async function createUser() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User();
    user.name = 'Nanu';
    user.email = 'nanu@gmail.com';
    user.password = hashedPassword;
    user.weight = 75;
    user.height = 180;
    user.gender = 'male';
    user.age = 30;
    user.timesPerWeek = 4;
    user.timePerSession = 60;
    user.repRange = '8-12';
    return await userRepository.save(user);
}

async function createExercises() {
    const savedExercises = [];
    for (const exercise of exercises) {
        let existingExercise = await exerciseRepository.findOne({ where: { name: exercise.name } });
        if (!existingExercise) {
            const newExercise = new Exercise();
            newExercise.name = exercise.name;
            newExercise.muscleGroup = exercise.muscleGroup;
            existingExercise = await exerciseRepository.save(newExercise);
        }
        savedExercises.push(existingExercise);
    }
    return savedExercises;
}

async function createTraining(user: User, exercises: Exercise[], date: Date) {
    const training = new Training();
    training.date = date;
    training.userId = user.id;
    const savedTraining = await trainingRepository.save(training);

    // Create 3-6 random exercises for this training
    const numExercises = faker.number.int({ min: 3, max: 6 });
    const selectedExercises = faker.helpers.arrayElements(exercises, numExercises);

    for (const exercise of selectedExercises) {
        const trainingExercise = new TrainingExercise();
        trainingExercise.training = savedTraining;
        trainingExercise.exercise = exercise;
        trainingExercise.weight = faker.number.int({ min: 20, max: 200 });
        trainingExercise.trainingId = savedTraining.id;
        trainingExercise.exerciseId = exercise.id;
        await trainingExerciseRepository.save(trainingExercise);
    }

    return savedTraining;
}

async function populateDatabase() {
    try {
        console.log('Initializing database connection...');
        await AppDataSource.initialize();

        // Delete existing data
        console.log('Deleting existing data...');
        await trainingExerciseRepository.delete({});
        await trainingRepository.delete({});
        await exerciseRepository.delete({});
        await userRepository.delete({ email: 'nanu@gmail.com' });

        // Create or get user
        console.log('Creating user...');
        let user = await userRepository.findOne({ where: { email: 'nanu@gmail.com' } });
        if (!user) {
            user = await createUser();
        }

        // Create exercises
        console.log('Creating exercises...');
        const savedExercises = await createExercises();

        // Create trainings
        console.log('Creating trainings...');
        const startDate = new Date('2023-01-01');
        const endDate = new Date('2024-12-31');
        const totalTrainings = 10000;
        const batchSize = 1000;

        for (let i = 0; i < totalTrainings; i += batchSize) {
            const batch = [];
            for (let j = 0; j < batchSize && i + j < totalTrainings; j++) {
                const date = faker.date.between({ from: startDate, to: endDate });
                batch.push(createTraining(user, savedExercises, date));
            }
            await Promise.all(batch);
            console.log(`Created ${i + batch.length} trainings...`);
        }

        console.log('Database population completed successfully!');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        await AppDataSource.destroy();
        console.log('Database connection closed');
    }
}

// Run the population
populateDatabase(); 