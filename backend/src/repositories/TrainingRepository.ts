import { AppDataSource } from '../config/database';
import { Training } from '../entities/Training';
import { Between } from 'typeorm';

export interface TrainingFilterOptions {
    userId: string;
    searchTerm?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export const TrainingRepository = AppDataSource.getRepository(Training).extend({
    async findAllWithFilters(options: TrainingFilterOptions) {
        const { userId, searchTerm, sortField, sortDirection } = options;

        const queryBuilder = this.createQueryBuilder('training')
            .leftJoinAndSelect('training.trainingExercises', 'trainingExercise')
            .leftJoinAndSelect('trainingExercise.exercise', 'exercise')
            .where('training.userId = :userId', { userId });

        if (searchTerm) {
            queryBuilder.andWhere(
                '(exercise.name ILIKE :search OR training.date::text ILIKE :search)',
                { search: `%${searchTerm}%` }
            );
        }

        // Default sort by date desc
        if (!sortField || sortField === 'date') {
            queryBuilder.orderBy('training.date', sortDirection === 'asc' ? 'ASC' : 'DESC');
        }
        // Note: 'pr' and 'exercises' sorting is handled in service after transformation

        // Pagination is handled in service because of the complex transformation and filtering
        // But we should fetch all matching records here to allow service to paginate correctly
        // OR we can try to paginate here if possible. 
        // The service code suggests it fetches all and then paginates.

        return queryBuilder.getMany();
    },

    async findByDate(date: Date, userId: string): Promise<Training | null> {
        return this.findOne({
            where: {
                date: date,
                userId: userId
            },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
    },

    async findByDateRange(startDate: Date, endDate: Date, userId: string): Promise<Training | null> {
        return this.findOne({
            where: {
                date: Between(startDate, endDate),
                userId: userId
            },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
    }
});
