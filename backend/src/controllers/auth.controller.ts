import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';

export class AuthController {
    static register = asyncHandler(async (req: Request, res: Response) => {
        const { user, token } = await AuthService.register(req.body);
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

    static login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const { user, token } = await AuthService.login(email, password);
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

    static loginWithGoogle = asyncHandler(async (req: Request, res: Response) => {
        const { token } = req.body;
        if (!token) {
            throw new AppError('Google token is required', 400);
        }

        const { user, token: jwtToken, createdNewUser } = await AuthService.loginWithGoogle(token);
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
}