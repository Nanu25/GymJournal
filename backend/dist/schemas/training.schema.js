"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrainingSchema = exports.updateTrainingSchema = exports.createTrainingSchema = void 0;
const zod_1 = require("zod");
exports.createTrainingSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string({
            required_error: 'Date is required',
        }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
        exercises: zod_1.z.record(zod_1.z.string(), zod_1.z.number(), {
            required_error: 'Exercises are required',
        }).refine((data) => Object.keys(data).length > 0, {
            message: 'At least one exercise is required',
        }),
    }),
});
exports.updateTrainingSchema = zod_1.z.object({
    params: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    }),
    body: zod_1.z.object({
        exercises: zod_1.z.record(zod_1.z.string(), zod_1.z.number(), {
            required_error: 'Exercises are required',
        }).refine((data) => Object.keys(data).length > 0, {
            message: 'At least one exercise is required',
        }),
    }),
});
exports.deleteTrainingSchema = zod_1.z.object({
    params: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    }),
});
//# sourceMappingURL=training.schema.js.map