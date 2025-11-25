
import { AppDataSource } from './backend/src/config/database';
import { Exercise } from './backend/src/entities/Exercise';

async function checkExercises() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected');

        const count = await AppDataSource.getRepository(Exercise).count();
        console.log(`Exercise count in DB: ${count}`);

        if (count > 0) {
            const first = await AppDataSource.getRepository(Exercise).findOne({ where: {} });
            console.log('First exercise:', first);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkExercises();
