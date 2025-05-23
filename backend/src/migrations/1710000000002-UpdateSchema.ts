import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1710000000002 implements MigrationInterface {
    name = 'UpdateSchema1710000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Helper function to check if table exists
        const tableExists = async (tableName: string): Promise<boolean> => {
            const result = await queryRunner.query(
                `SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = $1
                )`,
                [tableName]
            );
            return result[0].exists;
        };

        // Create users table if it doesn't exist
        if (!(await tableExists('users'))) {
            await queryRunner.query(`
                CREATE TABLE "users" (
                    "id" SERIAL NOT NULL,
                    "email" character varying NOT NULL,
                    "password" character varying NOT NULL,
                    "isAdmin" boolean NOT NULL DEFAULT false,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                    CONSTRAINT "PK_users" PRIMARY KEY ("id")
                )
            `);
        }

        // Create exercises table if it doesn't exist
        if (!(await tableExists('exercises'))) {
            await queryRunner.query(`
                CREATE TABLE "exercises" (
                    "id" SERIAL NOT NULL,
                    "name" character varying NOT NULL,
                    "muscleGroup" character varying NOT NULL,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "UQ_exercises_name" UNIQUE ("name"),
                    CONSTRAINT "PK_exercises" PRIMARY KEY ("id")
                )
            `);
        }

        // Create trainings table if it doesn't exist
        if (!(await tableExists('trainings'))) {
            await queryRunner.query(`
                CREATE TABLE "trainings" (
                    "id" SERIAL NOT NULL,
                    "userId" integer NOT NULL,
                    "date" TIMESTAMP NOT NULL,
                    "exercises" jsonb,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_trainings" PRIMARY KEY ("id")
                )
            `);
        }

        // Create training_exercises table if it doesn't exist
        if (!(await tableExists('training_exercises'))) {
            await queryRunner.query(`
                CREATE TABLE "training_exercises" (
                    "id" SERIAL NOT NULL,
                    "trainingId" integer NOT NULL,
                    "exerciseId" integer NOT NULL,
                    "weight" integer NOT NULL,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_training_exercises" PRIMARY KEY ("id")
                )
            `);
        }

        // Create activity_logs_action_enum if it doesn't exist
        const enumExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1 FROM pg_type 
                WHERE typname = 'activity_logs_action_enum'
            )
        `);
        
        if (!enumExists[0].exists) {
            await queryRunner.query(`
                CREATE TYPE "public"."activity_logs_action_enum" AS ENUM('CREATE', 'UPDATE', 'DELETE')
            `);
        }

        // Create activity_logs table if it doesn't exist
        if (!(await tableExists('activity_logs'))) {
            await queryRunner.query(`
                CREATE TABLE "activity_logs" (
                    "id" SERIAL NOT NULL,
                    "userId" integer NOT NULL,
                    "action" "public"."activity_logs_action_enum" NOT NULL,
                    "entityType" character varying NOT NULL,
                    "entityId" integer NOT NULL,
                    "details" jsonb,
                    "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_activity_logs" PRIMARY KEY ("id")
                )
            `);
        }

        // Create monitored_users table if it doesn't exist
        if (!(await tableExists('monitored_users'))) {
            await queryRunner.query(`
                CREATE TABLE "monitored_users" (
                    "id" SERIAL NOT NULL,
                    "userId" integer NOT NULL,
                    "monitoredBy" uuid NOT NULL,
                    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                    CONSTRAINT "PK_monitored_users" PRIMARY KEY ("id")
                )
            `);
        } else {
            // Add monitoredBy column if it doesn't exist
            const columnExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'monitored_users' 
                    AND column_name = 'monitoredBy'
                )
            `);
            
            if (!columnExists[0].exists) {
                await queryRunner.query(`
                    ALTER TABLE "monitored_users" 
                    ADD COLUMN "monitoredBy" uuid NOT NULL
                `);
            }
        }

        // Add foreign key constraints if they don't exist
        const addForeignKeyIfNotExists = async (constraintName: string, sql: string) => {
            const constraintExists = await queryRunner.query(`
                SELECT EXISTS (
                    SELECT 1 FROM information_schema.table_constraints 
                    WHERE constraint_name = $1
                )
            `, [constraintName]);
            
            if (!constraintExists[0].exists) {
                await queryRunner.query(sql);
            }
        };

        await addForeignKeyIfNotExists('FK_trainings_user', `
            ALTER TABLE "trainings" 
            ADD CONSTRAINT "FK_trainings_user" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
        `);

        await addForeignKeyIfNotExists('FK_training_exercises_training', `
            ALTER TABLE "training_exercises" 
            ADD CONSTRAINT "FK_training_exercises_training" 
            FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE CASCADE
        `);

        await addForeignKeyIfNotExists('FK_training_exercises_exercise', `
            ALTER TABLE "training_exercises" 
            ADD CONSTRAINT "FK_training_exercises_exercise" 
            FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE CASCADE
        `);

        await addForeignKeyIfNotExists('FK_activity_logs_user', `
            ALTER TABLE "activity_logs" 
            ADD CONSTRAINT "FK_activity_logs_user" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
        `);

        await addForeignKeyIfNotExists('FK_monitored_users_user', `
            ALTER TABLE "monitored_users" 
            ADD CONSTRAINT "FK_monitored_users_user" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
        `);

        await addForeignKeyIfNotExists('FK_monitored_users_monitored_by', `
            ALTER TABLE "monitored_users" 
            ADD CONSTRAINT "FK_monitored_users_monitored_by" 
            FOREIGN KEY ("monitoredBy") REFERENCES "users"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "monitored_users" DROP CONSTRAINT IF EXISTS "FK_monitored_users_monitored_by"`);
        await queryRunner.query(`ALTER TABLE "monitored_users" DROP CONSTRAINT IF EXISTS "FK_monitored_users_user"`);
        await queryRunner.query(`ALTER TABLE "activity_logs" DROP CONSTRAINT IF EXISTS "FK_activity_logs_user"`);
        await queryRunner.query(`ALTER TABLE "training_exercises" DROP CONSTRAINT IF EXISTS "FK_training_exercises_exercise"`);
        await queryRunner.query(`ALTER TABLE "training_exercises" DROP CONSTRAINT IF EXISTS "FK_training_exercises_training"`);
        await queryRunner.query(`ALTER TABLE "trainings" DROP CONSTRAINT IF EXISTS "FK_trainings_user"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE IF EXISTS "monitored_users"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "activity_logs"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."activity_logs_action_enum"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "training_exercises"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "trainings"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "exercises"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
} 