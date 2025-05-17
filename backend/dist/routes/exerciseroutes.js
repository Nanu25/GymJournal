"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const Exercise_1 = require("../entities/Exercise");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const exercises = await database_1.AppDataSource.getRepository(Exercise_1.Exercise).find();
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
        res.status(500).json({ error: 'Failed to fetch exercises' });
    }
});
exports.default = router;
//# sourceMappingURL=exerciseroutes.js.map