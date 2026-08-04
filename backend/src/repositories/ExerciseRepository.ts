import { AppDataSource } from '../config/database';
import { Exercise } from '../entities/Exercise';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const muscleGroupMapping = require('../data/muscleGroupMappingData.json');

export const ExerciseRepository = AppDataSource.getRepository(Exercise).extend({
    async findByNameOrCreate(name: string): Promise<Exercise> {
        let exercise = await this.findOne({ where: { name } });

        if (!exercise) {
            exercise = new Exercise();
            exercise.name = name;

            // Try to find muscle group from mapping
            const mapping = (muscleGroupMapping as any)[name];
            exercise.muscleGroup = mapping ? mapping.primary : 'Other';

            await this.save(exercise);
        }

        return exercise;
    }
});
