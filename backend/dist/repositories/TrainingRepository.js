"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingRepository = void 0;
const database_1 = require("../config/database");
const Training_1 = require("../entities/Training");
const typeorm_1 = require("typeorm");
exports.TrainingRepository = database_1.AppDataSource.getRepository(Training_1.Training).extend({
    async findAllWithFilters(options) {
        const { userId, searchTerm, sortField, sortDirection } = options;
        const queryBuilder = this.createQueryBuilder('training')
            .leftJoinAndSelect('training.trainingExercises', 'trainingExercise')
            .leftJoinAndSelect('trainingExercise.exercise', 'exercise')
            .where('training.userId = :userId', { userId });
        if (searchTerm) {
            queryBuilder.andWhere('(exercise.name ILIKE :search OR training.date::text ILIKE :search)', { search: `%${searchTerm}%` });
        }
        if (!sortField || sortField === 'date') {
            queryBuilder.orderBy('training.date', sortDirection === 'asc' ? 'ASC' : 'DESC');
        }
        return queryBuilder.getMany();
    },
    async findByDate(date, userId) {
        return this.findOne({
            where: {
                date: date,
                userId: userId
            },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
    },
    async findByDateRange(startDate, endDate, userId) {
        return this.findOne({
            where: {
                date: (0, typeorm_1.Between)(startDate, endDate),
                userId: userId
            },
            relations: ['trainingExercises', 'trainingExercises.exercise']
        });
    }
});
//# sourceMappingURL=TrainingRepository.js.map