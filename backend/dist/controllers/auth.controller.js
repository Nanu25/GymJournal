"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async register(req, res) {
        try {
            const { user, token } = await auth_service_1.AuthService.register(req.body);
            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        weight: user.weight,
                        height: user.height,
                        gender: user.gender,
                        age: user.age,
                        timesPerWeek: user.timesPerWeek,
                        timePerSession: user.timePerSession,
                        repRange: user.repRange,
                    },
                    token,
                },
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Registration failed',
            });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await auth_service_1.AuthService.login(email, password);
            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        weight: user.weight,
                        height: user.height,
                        gender: user.gender,
                        age: user.age,
                        timesPerWeek: user.timesPerWeek,
                        timePerSession: user.timePerSession,
                        repRange: user.repRange,
                    },
                    token,
                },
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                error: error instanceof Error ? error.message : 'Login failed',
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map