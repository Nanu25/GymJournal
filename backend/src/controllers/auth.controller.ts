import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
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
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Registration failed',
            });
        }
    }

    static async login(req: Request, res: Response) {
        try {
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
        } catch (error) {
            res.status(401).json({
                success: false,
                error: error instanceof Error ? error.message : 'Login failed',
            });
        }
    }
} 