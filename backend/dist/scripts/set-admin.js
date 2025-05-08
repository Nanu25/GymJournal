"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
async function setAdmin() {
    try {
        await database_1.AppDataSource.initialize();
        console.log('Database connection established');
        const user = await User_1.User.findOne({ where: { email: 'alex@gmail.com' } });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }
        user.isAdmin = true;
        await user.save();
        console.log('Successfully set alex@gmail.com as admin');
        process.exit(0);
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
setAdmin();
//# sourceMappingURL=set-admin.js.map