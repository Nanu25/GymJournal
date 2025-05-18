import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Exercise } from '../entities/Exercise';

const router = Router();

// Cache for exercises - refreshed every 10 minutes
let exercisesCache: { timestamp: number, data: any[] } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

// GET /api/exercises - returns exercises grouped by muscleGroup
router.get('/', async (_req: Request, res: Response) => {
  try {
    // Check if cache is valid
    const now = Date.now();
    if (exercisesCache && now - exercisesCache.timestamp < CACHE_TTL) {
      return res.json(exercisesCache.data);
    }

    // Cache is invalid or doesn't exist, fetch fresh data
    const exerciseRepository = AppDataSource.getRepository(Exercise);
    
    // Create a query builder for better performance
    const exercises = await exerciseRepository
      .createQueryBuilder('exercise')
      .select(['exercise.name', 'exercise.muscleGroup'])
      .cache(true) // TypeORM query cache
      .getMany();

    // Group by muscleGroup
    const grouped = exercises.reduce((acc: Record<string, string[]>, ex) => {
      const muscleGroup = ex.muscleGroup || 'Other';
      acc[muscleGroup] = acc[muscleGroup] || [];
      acc[muscleGroup].push(ex.name);
      return acc;
    }, {});

    // Convert to array of { category, exercises }
    const result = Object.entries(grouped).map(([category, exercises]) => ({
      category,
      exercises,
    }));

    // Update the cache
    exercisesCache = {
      timestamp: now,
      data: result
    };

    res.json(result);
  } catch (err) {
    console.error('Error fetching exercises:', err);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

export default router; 