import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1698521234567 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add index on Training.userId
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_training_userId 
            ON "training" ("userId");
        `);
        
        // Add index on Training.date
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_training_date 
            ON "training" ("date");
        `);

        // Add composite index on userId and date
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_training_userId_date 
            ON "training" ("userId", "date");
        `);
        
        // Add index on TrainingExercise.trainingId
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_training_exercise_trainingId 
            ON "training_exercise" ("trainingId");
        `);
        
        // Add index on TrainingExercise.exerciseId
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_training_exercise_exerciseId 
            ON "training_exercise" ("exerciseId");
        `);
        
        // Add index on Exercise.name
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_exercise_name 
            ON "exercise" ("name");
        `);
        
        // Add index on Exercise.muscleGroup
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_exercise_muscleGroup 
            ON "exercise" ("muscleGroup");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_training_userId`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_training_date`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_training_userId_date`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_training_exercise_trainingId`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_training_exercise_exerciseId`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_exercise_name`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_exercise_muscleGroup`);
    }
} 