import { MigrationInterface, QueryRunner } from "typeorm";

export class SetAdminUser1710000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE users 
            SET "isAdmin" = true 
            WHERE email = 'alex@gmail.com'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE users 
            SET "isAdmin" = false 
            WHERE email = 'alex@gmail.com'
        `);
    }
} 