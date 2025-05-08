"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const User_1 = require("../entities/User");
class AdminController {
    static async getAllUsers(req, res) {
        try {
            const users = await User_1.User.find({
                select: ['id', 'name', 'email', 'isAdmin', 'createdAt', 'updatedAt']
            });
            res.status(200).json({
                success: true,
                data: users
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch users'
            });
        }
    }
    static async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            const user = await User_1.User.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }
            await user.remove();
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete user'
            });
        }
    }
    static async updateUserRole(req, res) {
        try {
            const { userId } = req.params;
            const { isAdmin } = req.body;
            const user = await User_1.User.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }
            user.isAdmin = isAdmin;
            await user.save();
            res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update user role'
            });
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map