import { AppDataSource } from '../config/database';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';
import { TrainingExercise } from '../entities/TrainingExercise';
import { User } from '../entities/User';

describe('Database Operations', () => {
    let userRepository: any;
    let trainingRepository: any;
    let exerciseRepository: any;
    let trainingExerciseRepository: any;
    let testUser: User;
    let testExercise: Exercise;
    let testTraining: Training;
    let testTrainingExercise: TrainingExercise;

    beforeAll(async () => {
        // Initialize database connection
        await AppDataSource.initialize();
        
        // Get repositories
        userRepository = AppDataSource.getRepository(User);
        trainingRepository = AppDataSource.getRepository(Training);
        exerciseRepository = AppDataSource.getRepository(Exercise);
        trainingExerciseRepository = AppDataSource.getRepository(TrainingExercise);

        // Get existing user
        testUser = await userRepository.findOne({ where: { email: 'alex@gmail.com' } });
        if (!testUser) {
            throw new Error('Test user not found. Please ensure alex@gmail.com exists in the database.');
        }
    });

    beforeEach(async () => {
        // Create test exercise
        testExercise = new Exercise();
        testExercise.name = 'Test Exercise';
        testExercise.muscleGroup = 'Test Group';
        testExercise = await exerciseRepository.save(testExercise);

        // Create test training
        testTraining = new Training();
        testTraining.date = new Date();
        testTraining.userId = testUser.id;
        testTraining = await trainingRepository.save(testTraining);

        // Create test training-exercise relationship
        testTrainingExercise = new TrainingExercise();
        testTrainingExercise.training = testTraining;
        testTrainingExercise.exercise = testExercise;
        testTrainingExercise.weight = 100;
        testTrainingExercise.trainingId = testTraining.id;
        testTrainingExercise.exerciseId = testExercise.id;
        testTrainingExercise = await trainingExerciseRepository.save(testTrainingExercise);
    });

    afterEach(async () => {
        // Clean up only the test training and exercise data
        if (testTrainingExercise?.id) {
            await trainingExerciseRepository.delete({ id: testTrainingExercise.id });
        }
        if (testTraining?.id) {
            await trainingRepository.delete({ id: testTraining.id });
        }
        if (testExercise?.id) {
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

            // Verify the update
            const training = await trainingRepository.findOne({ 
                where: { id: testTraining.id },
                relations: ['trainingExercises', 'trainingExercises.exercise']
            });
            expect(training.trainingExercises[0].weight).toBe(120);
        });

        it('should delete training and its relationships', async () => {
            const trainingId = testTraining.id;
            const trainingExerciseId = testTrainingExercise.id;

            // Delete the training
            await trainingExerciseRepository.delete({ id: trainingExerciseId });
            await trainingRepository.delete({ id: trainingId });

            // Verify deletion
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