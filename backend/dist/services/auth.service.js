"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const bcryptWrapper_1 = __importDefault(require("../utils/bcryptWrapper"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
class AuthService {
    static async register(userData) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const existingUser = await userRepository.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const hashedPassword = await bcryptWrapper_1.default.hash(userData.password, 10);
        const user = userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        await userRepository.save(user);
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return { user, token };
    }
    static async login(email, password) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.password) {
            throw new Error('This account uses Google login. Please sign in with Google.');
        }
        const isPasswordValid = await bcryptWrapper_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return { user, token };
    }
    static async loginWithGoogle(googleToken) {
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        try {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error('Invalid Google token');
            }
            const userRepository = database_1.AppDataSource.getRepository(User_1.User);
            let user = await userRepository.findOne({ where: { googleId: payload.sub } });
            let createdNewUser = false;
            if (!user) {
                user = await userRepository.findOne({ where: { email: payload.email } });
                if (user && !user.googleId) {
                    user.googleId = payload.sub;
                    await userRepository.save(user);
                }
            }
            if (!user) {
                user = userRepository.create({
                    email: payload.email,
                    name: payload.name || payload.email.split('@')[0],
                    googleId: payload.sub,
                });
                await userRepository.save(user);
                createdNewUser = true;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return { user, token, createdNewUser };
        }
        catch (error) {
            console.error('Google authentication error:', error);
            throw new Error('Google authentication failed');
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map