"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingExercise = void 0;
const typeorm_1 = require("typeorm");
const Training_1 = require("./Training");
const Exercise_1 = require("./Exercise");
let TrainingExercise = class TrainingExercise {
};
exports.TrainingExercise = TrainingExercise;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TrainingExercise.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TrainingExercise.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrainingExercise.prototype, "trainingId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TrainingExercise.prototype, "exerciseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Training_1.Training, training => training.trainingExercises),
    (0, typeorm_1.JoinColumn)({ name: 'trainingId' }),
    __metadata("design:type", Training_1.Training)
], TrainingExercise.prototype, "training", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Exercise_1.Exercise, exercise => exercise.trainingExercises),
    (0, typeorm_1.JoinColumn)({ name: 'exerciseId' }),
    __metadata("design:type", Exercise_1.Exercise)
], TrainingExercise.prototype, "exercise", void 0);
exports.TrainingExercise = TrainingExercise = __decorate([
    (0, typeorm_1.Entity)()
], TrainingExercise);
//# sourceMappingURL=TrainingExercise.js.map