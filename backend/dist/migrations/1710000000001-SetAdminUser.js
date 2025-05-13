"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAdminUser1710000000001 = void 0;
class SetAdminUser1710000000001 {
    async up(queryRunner) {
        await queryRunner.query(`
            UPDATE users 
            SET "isAdmin" = true 
            WHERE email = 'alex@gmail.com'
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            UPDATE users 
            SET "isAdmin" = false 
            WHERE email = 'alex@gmail.com'
        `);
    }
}
exports.SetAdminUser1710000000001 = SetAdminUser1710000000001;
//# sourceMappingURL=1710000000001-SetAdminUser.js.map