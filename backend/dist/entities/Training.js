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
exports.Training = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const TrainingExercise_1 = require("./TrainingExercise");
let Training = class Training extends typeorm_1.BaseEntity {
};
exports.Training = Training;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Training.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Training.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.trainings),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], Training.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Object)
], Training.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TrainingExercise_1.TrainingExercise, trainingExercise => trainingExercise.training, {
        cascade: true
    }),
    __metadata("design:type", Array)
], Training.prototype, "trainingExercises", void 0);
exports.Training = Training = __decorate([
    (0, typeorm_1.Entity)('trainings')
], Training);
//# sourceMappingURL=Training.js.map