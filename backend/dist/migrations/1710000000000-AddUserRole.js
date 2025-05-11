"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserRole1710000000000 = void 0;
class AddUserRole1710000000000 {
    constructor() {
        this.name = 'AddUserRole1710000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`UPDATE "users" SET "isAdmin" = true WHERE "email" = 'nanu@gmail.com'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
    }
}
exports.AddUserRole1710000000000 = AddUserRole1710000000000;
//# sourceMappingURL=1710000000000-AddUserRole.js.map