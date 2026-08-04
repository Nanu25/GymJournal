import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import bcrypt from '../utils/bcryptWrapper';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../utils/AppError';

export class AuthService {
    static async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new AppError('Email already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(userData.password!, 10);
        const user = userRepository.create({
            ...userData,
            password: hashedPassword,
        });

        await userRepository.save(user);

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        return { user, token };
    }

    static async login(email: string, password: string): Promise<{ user: User; token: string }> {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Check if user has a password (not a Google user)
        if (!user.password) {
            throw new AppError('This account uses Google login. Please sign in with Google.', 400);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid password', 401);
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return { user, token };
    }

    static async loginWithGoogle(googleToken: string): Promise<{ user: User; token: string; createdNewUser: boolean }> {
        const client = new OAuth2Client();
        const audience = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

        try {
            // Verify the Google ID Token with Google's public keys
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                ...(audience ? { audience } : {})
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new AppError('Invalid Google token payload', 400);
            }

            const userRepository = AppDataSource.getRepository(User);

            // Check if user exists by Google ID
            let user = await userRepository.findOne({ where: { googleId: payload.sub } });
            let createdNewUser = false;

            // If not found by Google ID, check by email
            if (!user) {
                user = await userRepository.findOne({ where: { email: payload.email } });

                // If user exists but doesn't have Google ID, link it
                if (user && !user.googleId) {
                    user.googleId = payload.sub;
                    await userRepository.save(user);
                }
            }

            // Create new user if doesn't exist
            if (!user) {
                user = userRepository.create({
                    email: payload.email!,
                    name: payload.name || payload.email!.split('@')[0],
                    googleId: payload.sub,
                    // Leave password as undefined for Google users
                });
                await userRepository.save(user);
                createdNewUser = true;
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            return { user, token, createdNewUser };
        } catch (error: any) {
            console.error('Google authentication error details:', error?.message || error);
            throw new AppError(error?.message ? `Google authentication failed: ${error.message}` : 'Google authentication failed', 401);
        }
    }
}