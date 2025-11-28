import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

export const UserRepository = AppDataSource.getRepository(User).extend({
    async findById(id: string): Promise<User | null> {
        return this.findOne({ where: { id } });
    },

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }
});
