import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { Exercise } from '../entities/Exercise';

const router = Router();

// GET /api/exercises - returns exercises grouped by muscleGroup
router.get('/', async (_req, res) => {
  console.log('[EXERCISE_ROUTES] Getting exercise list...');
  
  try {
    // Check if database is initialized
    if (!AppDataSource.isInitialized) {
      console.error('[EXERCISE_ROUTES] Database not initialized, using mock data');
      return sendMockExercises(res);
    }
    
    console.log('[EXERCISE_ROUTES] Fetching exercises from database...');
    const exercises = await AppDataSource.getRepository(Exercise).find();
    
    if (!exercises || exercises.length === 0) {
      console.log('[EXERCISE_ROUTES] No exercises found in database, using mock data');
      return sendMockExercises(res);
    }
    
    console.log(`[EXERCISE_ROUTES] Found ${exercises.length} exercises in the database`);
    
    // Group by muscleGroup
    const grouped = exercises.reduce((acc: Record<string, string[]>, ex) => {
      const muscleGroup = ex.muscleGroup;
      if (!acc[muscleGroup]) {
        acc[muscleGroup] = [];
      }
      acc[muscleGroup].push(ex.name);
      return acc;
    }, {});
    
    // Convert to array of { category, exercises }
    const result = Object.entries(grouped).map(([category, exercises]) => ({
      category,
      exercises,
    }));
    
    // Add a data source indicator
    const responseWithMetadata = {
      source: 'database',
      count: exercises.length,
      categories: result.length,
      data: result
    };
    
    res.json(responseWithMetadata);
  } catch (err) {
    console.error('[EXERCISE_ROUTES] Error fetching exercises:', err);
    sendMockExercises(res);
  }
});

// Function to send mock exercise data
function sendMockExercises(res: any) {
  console.log('[EXERCISE_ROUTES] Sending mock exercise data');
  const mockExercises = [
    {
      category: 'Chest',
      exercises: ['Bench Press', 'Incline Press', 'Decline Press', 'Chest Fly', 'Push-ups']
    },
    {
      category: 'Back',
      exercises: ['Pull-ups', 'Lat Pulldown', 'Deadlift', 'Bent Over Row', 'T-Bar Row']
    },
    {
      category: 'Legs',
      exercises: ['Squat', 'Leg Press', 'Lunges', 'Leg Extension', 'Leg Curl', 'Calf Raise']
    },
    {
      category: 'Shoulders',
      exercises: ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Reverse Fly', 'Shrugs']
    },
    {
      category: 'Arms',
      exercises: ['Bicep Curl', 'Tricep Extension', 'Hammer Curl', 'Skull Crusher', 'Chin-ups']
    },
    {
      category: 'Core',
      exercises: ['Crunches', 'Leg Raises', 'Plank', 'Russian Twist', 'Ab Wheel Rollout']
    }
  ];
  
  // Add metadata to the response
  const responseWithMetadata = {
    source: 'mock',
    count: mockExercises.reduce((sum, cat) => sum + cat.exercises.length, 0),
    categories: mockExercises.length,
    data: mockExercises
  };
  
  res.json(responseWithMetadata);
}

export default router; 