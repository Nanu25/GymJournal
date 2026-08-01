"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddGoogleIdToUser1730000000000 = void 0;
const typeorm_1 = require("typeorm");
class AddGoogleIdToUser1730000000000 {
    async up(queryRunner) {
        await queryRunner.changeColumn("users", "password", new typeorm_1.TableColumn({
            name: "password",
            type: "varchar",
            isNullable: true
        }));
        await queryRunner.addColumn("users", new typeorm_1.TableColumn({
            name: "googleId",
            type: "varchar",
            isNullable: true,
            isUnique: true
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("users", "googleId");
        await queryRunner.changeColumn("users", "password", new typeorm_1.TableColumn({
            name: "password",
            type: "varchar",
            isNullable: false
        }));
    }
}
exports.AddGoogleIdToUser1730000000000 = AddGoogleIdToUser1730000000000;
//# sourceMappingURL=1730000000000-AddGoogleIdToUser.js.map