import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { Exercise } from '../entities/Exercise';

const router = Router();

// GET /api/exercises - returns exercises grouped by muscleGroup
router.get('/', async (_req, res) => {
  try {
    const exercises = await AppDataSource.getRepository(Exercise).find();
    // Group by muscleGroup
    const grouped = exercises.reduce((acc: Record<string, string[]>, ex) => {
      acc[ex.muscleGroup] = acc[ex.muscleGroup] || [];
      acc[ex.muscleGroup].push(ex.name);
      return acc;
    }, {});
    // Convert to array of { category, exercises }
    const result = Object.entries(grouped).map(([category, exercises]) => ({
      category,
      exercises,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

export default router; 