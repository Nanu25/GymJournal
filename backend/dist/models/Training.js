"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Training = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TrainingSchema = new mongoose_1.default.Schema({
    date: { type: String, required: true },
    exercises: { type: Map, of: Number, required: true }
});
exports.Training = mongoose_1.default.model('Training', TrainingSchema);
