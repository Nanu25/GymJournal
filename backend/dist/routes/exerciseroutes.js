"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const Exercise_1 = require("../entities/Exercise");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    console.log('[EXERCISE_ROUTES] Getting exercise list...');
    try {
        if (!database_1.AppDataSource.isInitialized) {
            console.error('[EXERCISE_ROUTES] Database not initialized, using mock data');
            return sendMockExercises(res);
        }
        console.log('[EXERCISE_ROUTES] Fetching exercises from database...');
        const exercises = await database_1.AppDataSource.getRepository(Exercise_1.Exercise).find();
        if (!exercises || exercises.length === 0) {
            console.log('[EXERCISE_ROUTES] No exercises found in database, using mock data');
            return sendMockExercises(res);
        }
        console.log(`[EXERCISE_ROUTES] Found ${exercises.length} exercises in the database`);
        const grouped = exercises.reduce((acc, ex) => {
            acc[ex.muscleGroup] = acc[ex.muscleGroup] || [];
            acc[ex.muscleGroup].push(ex.name);
            return acc;
        }, {});
        const result = Object.entries(grouped).map(([category, exercises]) => ({
            category,
            exercises,
        }));
        res.json(result);
    }
    catch (err) {
        console.error('[EXERCISE_ROUTES] Error fetching exercises:', err);
        sendMockExercises(res);
    }
});
function sendMockExercises(res) {
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
    res.json(mockExercises);
}
exports.default = router;
//# sourceMappingURL=exerciseroutes.js.map