import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserRole1710000000000 implements MigrationInterface {
    name = 'AddUserRole1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add isAdmin column with default value false
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
        
        // Set a specific user as admin
        await queryRunner.query(`UPDATE "users" SET "isAdmin" = true WHERE "email" = 'nanu@gmail.com'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the isAdmin column
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
    }
} 