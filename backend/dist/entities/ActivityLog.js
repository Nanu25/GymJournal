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
exports.ActivityLog = exports.ActionType = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
var ActionType;
(function (ActionType) {
    ActionType["CREATE"] = "create";
    ActionType["READ"] = "read";
    ActionType["UPDATE"] = "update";
    ActionType["DELETE"] = "delete";
})(ActionType || (exports.ActionType = ActionType = {}));
let ActivityLog = class ActivityLog {
};
exports.ActivityLog = ActivityLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ActivityLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], ActivityLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ActionType
    }),
    __metadata("design:type", String)
], ActivityLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ActivityLog.prototype, "entityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "entityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ActivityLog.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivityLog.prototype, "timestamp", void 0);
exports.ActivityLog = ActivityLog = __decorate([
    (0, typeorm_1.Entity)('activity_logs')
], ActivityLog);
//# sourceMappingURL=ActivityLog.js.map