"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const User_1 = require("../entities/User");
const faker_1 = require("@faker-js/faker");
const bcrypt_1 = __importDefault(require("bcryptjs"));
const trainingRepository = database_1.AppDataSource.getRepository(Training_1.Training);
const exerciseRepository = database_1.AppDataSource.getRepository(Exercise_1.Exercise);
const trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
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
    const hashedPassword = await bcrypt_1.default.hash('password123', 10);
    const user = new User_1.User();
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
            const newExercise = new Exercise_1.Exercise();
            newExercise.name = exercise.name;
            newExercise.muscleGroup = exercise.muscleGroup;
            existingExercise = await exerciseRepository.save(newExercise);
        }
        savedExercises.push(existingExercise);
    }
    return savedExercises;
}
async function createTraining(user, exercises, date) {
    const training = new Training_1.Training();
    training.date = date;
    training.userId = user.id;
    const savedTraining = await trainingRepository.save(training);
    const numExercises = faker_1.faker.number.int({ min: 3, max: 6 });
    const selectedExercises = faker_1.faker.helpers.arrayElements(exercises, numExercises);
    for (const exercise of selectedExercises) {
        const trainingExercise = new TrainingExercise_1.TrainingExercise();
        trainingExercise.training = savedTraining;
        trainingExercise.exercise = exercise;
        trainingExercise.weight = faker_1.faker.number.int({ min: 20, max: 200 });
        trainingExercise.trainingId = savedTraining.id;
        trainingExercise.exerciseId = exercise.id;
        await trainingExerciseRepository.save(trainingExercise);
    }
    return savedTraining;
}
async function populateDatabase() {
    try {
        console.log('Initializing database connection...');
        await database_1.AppDataSource.initialize();
        console.log('Deleting existing data...');
        await trainingExerciseRepository.delete({});
        await trainingRepository.delete({});
        await exerciseRepository.delete({});
        await userRepository.delete({ email: 'nanu@gmail.com' });
        console.log('Creating user...');
        let user = await userRepository.findOne({ where: { email: 'nanu@gmail.com' } });
        if (!user) {
            user = await createUser();
        }
        console.log('Creating exercises...');
        const savedExercises = await createExercises();
        console.log('Creating trainings...');
        const startDate = new Date('2023-01-01');
        const endDate = new Date('2024-12-31');
        const totalTrainings = 10000;
        const batchSize = 1000;
        for (let i = 0; i < totalTrainings; i += batchSize) {
            const batch = [];
            for (let j = 0; j < batchSize && i + j < totalTrainings; j++) {
                const date = faker_1.faker.date.between({ from: startDate, to: endDate });
                batch.push(createTraining(user, savedExercises, date));
            }
            await Promise.all(batch);
            console.log(`Created ${i + batch.length} trainings...`);
        }
        console.log('Database population completed successfully!');
    }
    catch (error) {
        console.error('Error populating database:', error);
    }
    finally {
        await database_1.AppDataSource.destroy();
        console.log('Database connection closed');
    }
}
populateDatabase();
//# sourceMappingURL=populateDatabase.js.map