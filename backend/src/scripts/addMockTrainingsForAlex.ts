import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Training } from '../entities/Training';
import { Exercise } from '../entities/Exercise';
import { TrainingExercise } from '../entities/TrainingExercise';
import * as path from 'path';
import * as fs from 'fs';

interface MockTraining {
  date: string;
  exercises: Record<string, number>;
}

async function main() {
  console.log('Initializing database connection...');
  await AppDataSource.initialize();
  
  // Get repositories
  const userRepo = AppDataSource.getRepository(User);
  const trainingRepo = AppDataSource.getRepository(Training);
  const exerciseRepo = AppDataSource.getRepository(Exercise);
  const trainingExerciseRepo = AppDataSource.getRepository(TrainingExercise);
  
  // Find or create user Alex
  console.log('Finding or creating user Alex...');
  let alex = await userRepo.findOne({ where: { name: 'Alex' } });
  
  if (!alex) {
    console.log('User Alex not found. Creating new user...');
    alex = new User();
    alex.name = 'Alex';
    alex.email = 'alex@example.com';
    alex.weight = 75; // default weight
    alex.password = 'password123'; // this would be hashed in a real scenario
    alex = await userRepo.save(alex);
    console.log(`Created new user with ID: ${alex.id}`);
  } else {
    console.log(`Found existing user Alex with ID: ${alex.id}`);
  }
  
  // Load mock trainings
  console.log('Loading mock trainings data...');
  const dataPath = path.join(__dirname, '../data/mockTrainings.json');
  const mockTrainings: MockTraining[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  console.log(`Found ${mockTrainings.length} mock trainings to import`);
  
  // Add trainings for Alex
  let addedTrainings = 0;
  let skippedTrainings = 0;
  
  for (const mockTraining of mockTrainings) {
    // Check if training for this date already exists
    const existingTraining = await trainingRepo.findOne({
      where: {
        userId: alex.id,
        date: new Date(mockTraining.date)
      }
    });
    
    if (existingTraining) {
      console.log(`Training for date ${mockTraining.date} already exists. Skipping...`);
      skippedTrainings++;
      continue;
    }
    
    // Create new training
    console.log(`Adding training for date ${mockTraining.date}`);
    const training = new Training();
    training.date = new Date(mockTraining.date);
    training.userId = alex.id;
    
    // Add exercises data directly to the training entity
    training.exercises = mockTraining.exercises;
    
    // Save training
    const savedTraining = await trainingRepo.save(training);
    
    // Process exercises
    const trainingExercises: TrainingExercise[] = [];
    
    for (const [exerciseName, weight] of Object.entries(mockTraining.exercises)) {
      // Find or create exercise
      let exercise = await exerciseRepo.findOne({ where: { name: exerciseName } });
      
      if (!exercise) {
        console.log(`Exercise ${exerciseName} not found. Creating...`);
        exercise = new Exercise();
        exercise.name = exerciseName;
        // Default to 'Other' if we don't have muscle group data
        exercise.muscleGroup = 'Other';
        await exerciseRepo.save(exercise);
      }
      
      // Create training exercise relationship
      const trainingExercise = new TrainingExercise();
      trainingExercise.trainingId = savedTraining.id;
      trainingExercise.exerciseId = exercise.id;
      trainingExercise.training = savedTraining;
      trainingExercise.exercise = exercise;
      trainingExercise.weight = weight;
      
      trainingExercises.push(trainingExercise);
    }
    
    // Save training exercises
    await trainingExerciseRepo.save(trainingExercises);
    addedTrainings++;
    
    console.log(`Added training for date ${mockTraining.date} with ${Object.keys(mockTraining.exercises).length} exercises`);
  }
  
  console.log(`Done! Added: ${addedTrainings}, Skipped (already existed): ${skippedTrainings}`);
  await AppDataSource.destroy();
}

main().catch(err => {
  console.error('Error adding mock trainings:', err);
  process.exit(1);
}); 