import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddGoogleIdToUser1730000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Make password nullable
        await queryRunner.changeColumn("users", "password", new TableColumn({
            name: "password",
            type: "varchar",
            isNullable: true
        }));

        // Add googleId column
        await queryRunner.addColumn("users", new TableColumn({
            name: "googleId",
            type: "varchar",
            isNullable: true,
            isUnique: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove googleId column
        await queryRunner.dropColumn("users", "googleId");

        // Make password not nullable again
        await queryRunner.changeColumn("users", "password", new TableColumn({
            name: "password",
            type: "varchar",
            isNullable: false
        }));
    }
}

