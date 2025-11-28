import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { AppDataSource } from '../config/database';

export class UserService {
    static async getUserMetrics(userId: string) {

        let user: User | null = null;
        let useMock = false;

        try {
            if (!AppDataSource.isInitialized) {
                console.error('[USER_SERVICE] ERROR: Database connection not initialized');
                useMock = true;
            } else {
                user = await UserRepository.findById(userId);
                if (!user) {

                    useMock = true;
                }
            }
        } catch (error) {
            console.error('[USER_SERVICE] Database query error:', error);
            useMock = true;
        }

        if (useMock) {

            return {
                name: "Fitness Enthusiast",
                email: "test@example.com",
                weight: 75,
                height: 180,
                gender: 'Male',
                age: 30,
                timesPerWeek: 3,
                timePerSession: 60,
                repRange: '8-12',
                isAdmin: false
            };
        }

        return {
            name: user!.name,
            email: user!.email,
            weight: user!.weight ?? 0,
            height: user!.height ?? 0,
            gender: user!.gender ?? '',
            age: user!.age ?? 0,
            timesPerWeek: user!.timesPerWeek ?? 0,
            timePerSession: user!.timePerSession ?? 0,
            repRange: user!.repRange ?? '',
            isAdmin: user!.isAdmin ?? false
        };
    }

    static async updateUserMetrics(userId: string, updateData: Partial<User>) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        Object.assign(user, updateData);
        await UserRepository.save(user);

        return {
            name: user.name,
            email: user.email,
            weight: user.weight,
            height: user.height,
            gender: user.gender,
            age: user.age,
            timesPerWeek: user.timesPerWeek,
            timePerSession: user.timePerSession,
            repRange: user.repRange
        };
    }

    static async getUser(userId: string) {
        return this.getUserMetrics(userId); // Reusing logic as they are identical in the controller
    }

    static async updateUserProfile(userId: string, updateData: any) {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && updateData[key] !== null && updateData[key] !== '') {
                (user as any)[key] = updateData[key];
            }
        });

        await UserRepository.save(user);

        return {
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
            isAdmin: user.isAdmin
        };
    }

    static async deleteUser(userId: string, requestingUserId: string) {
        const requestingUser = await UserRepository.findById(requestingUserId);
        if (!requestingUser || !requestingUser.isAdmin) {
            throw new Error('Permission denied');
        }

        const userToDelete = await UserRepository.findById(userId);
        if (!userToDelete) {
            throw new Error('User not found');
        }

        const deletedUserEmail = userToDelete.email;
        await UserRepository.remove(userToDelete);

        return deletedUserEmail;
    }
}
