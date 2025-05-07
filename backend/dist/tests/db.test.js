"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const Training_1 = require("../entities/Training");
const Exercise_1 = require("../entities/Exercise");
const TrainingExercise_1 = require("../entities/TrainingExercise");
const User_1 = require("../entities/User");
describe('Database Operations', () => {
    let userRepository;
    let trainingRepository;
    let exerciseRepository;
    let trainingExerciseRepository;
    let testUser;
    let testExercise;
    let testTraining;
    let testTrainingExercise;
    beforeAll(async () => {
        await database_1.AppDataSource.initialize();
        userRepository = database_1.AppDataSource.getRepository(User_1.User);
        trainingRepository = database_1.AppDataSource.getRepository(Training_1.Training);
        exerciseRepository = database_1.AppDataSource.getRepository(Exercise_1.Exercise);
        trainingExerciseRepository = database_1.AppDataSource.getRepository(TrainingExercise_1.TrainingExercise);
        testUser = await userRepository.findOne({ where: { email: 'alex@gmail.com' } });
        if (!testUser) {
            throw new Error('Test user not found. Please ensure alex@gmail.com exists in the database.');
        }
    });
    beforeEach(async () => {
        testExercise = new Exercise_1.Exercise();
        testExercise.name = 'Test Exercise';
        testExercise.muscleGroup = 'Test Group';
        testExercise = await exerciseRepository.save(testExercise);
        testTraining = new Training_1.Training();
        testTraining.date = new Date();
        testTraining.userId = testUser.id;
        testTraining = await trainingRepository.save(testTraining);
        testTrainingExercise = new TrainingExercise_1.TrainingExercise();
        testTrainingExercise.training = testTraining;
        testTrainingExercise.exercise = testExercise;
        testTrainingExercise.weight = 100;
        testTrainingExercise.trainingId = testTraining.id;
        testTrainingExercise.exerciseId = testExercise.id;
        testTrainingExercise = await trainingExerciseRepository.save(testTrainingExercise);
    });
    afterEach(async () => {
        if (testTrainingExercise === null || testTrainingExercise === void 0 ? void 0 : testTrainingExercise.id) {
            await trainingExerciseRepository.delete({ id: testTrainingExercise.id });
        }
        if (testTraining === null || testTraining === void 0 ? void 0 : testTraining.id) {
            await trainingRepository.delete({ id: testTraining.id });
        }
        if (testExercise === null || testExercise === void 0 ? void 0 : testExercise.id) {
            await exerciseRepository.delete({ id: testExercise.id });
        }
    });
    describe('Training CRUD Operations', () => {
        it('should create a new training', async () => {
            const training = await trainingRepository.findOne({
                where: { id: testTraining.id },
                relations: ['trainingExercises', 'trainingExercises.exercise']
            });
            expect(training).toBeDefined();
            expect(training.userId).toBe(testUser.id);
            expect(training.trainingExercises).toHaveLength(1);
            expect(training.trainingExercises[0].weight).toBe(100);
        });
        it('should read training details', async () => {
            const training = await trainingRepository.findOne({
                where: { id: testTraining.id },
                relations: ['trainingExercises', 'trainingExercises.exercise']
            });
            expect(training).toBeDefined();
            expect(training.trainingExercises[0].exercise.name).toBe('Test Exercise');
            expect(training.trainingExercises[0].weight).toBe(100);
        });
        it('should update training exercise weight', async () => {
            testTrainingExercise.weight = 120;
            const updatedTrainingExercise = await trainingExerciseRepository.save(testTrainingExercise);
            expect(updatedTrainingExercise.weight).toBe(120);
            const training = await trainingRepository.findOne({
                where: { id: testTraining.id },
                relations: ['trainingExercises', 'trainingExercises.exercise']
            });
            expect(training.trainingExercises[0].weight).toBe(120);
        });
        it('should delete training and its relationships', async () => {
            const trainingId = testTraining.id;
            const trainingExerciseId = testTrainingExercise.id;
            await trainingExerciseRepository.delete({ id: trainingExerciseId });
            await trainingRepository.delete({ id: trainingId });
            const deletedTraining = await trainingRepository.findOne({
                where: { id: trainingId }
            });
            expect(deletedTraining).toBeNull();
            const deletedTrainingExercise = await trainingExerciseRepository.findOne({
                where: { id: trainingExerciseId }
            });
            expect(deletedTrainingExercise).toBeNull();
        });
    });
});
//# sourceMappingURL=db.test.js.map