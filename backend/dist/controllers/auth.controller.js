"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
});
AuthController.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
});
AuthController.loginWithGoogle = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        throw new AppError_1.AppError('Google token is required', 400);
    }
    const { user, token: jwtToken, createdNewUser } = await auth_service_1.AuthService.loginWithGoogle(token);
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
            token: jwtToken,
            createdNewUser
        },
    });
});
//# sourceMappingURL=auth.controller.js.map