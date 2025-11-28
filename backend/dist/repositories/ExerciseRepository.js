"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseRepository = void 0;
const database_1 = require("../config/database");
const Exercise_1 = require("../entities/Exercise");
const muscleGroupMappingData_json_1 = __importDefault(require("../data/muscleGroupMappingData.json"));
exports.ExerciseRepository = database_1.AppDataSource.getRepository(Exercise_1.Exercise).extend({
    async findByNameOrCreate(name) {
        let exercise = await this.findOne({ where: { name } });
        if (!exercise) {
            exercise = new Exercise_1.Exercise();
            exercise.name = name;
            const mapping = muscleGroupMappingData_json_1.default[name];
            exercise.muscleGroup = mapping ? mapping.primary : 'Other';
            await this.save(exercise);
        }
        return exercise;
    }
});
//# sourceMappingURL=ExerciseRepository.js.map