import { z } from 'zod';

export const createTrainingSchema = z.object({
    body: z.object({
        date: z.string({
            required_error: 'Date is required',
        }).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
        exercises: z.record(z.string(), z.number(), {
            required_error: 'Exercises are required',
        }).refine((data) => Object.keys(data).length > 0, {
            message: 'At least one exercise is required',
        }),
    }),
});

export const updateTrainingSchema = z.object({
    params: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    }),
    body: z.object({
        exercises: z.record(z.string(), z.number(), {
            required_error: 'Exercises are required',
        }).refine((data) => Object.keys(data).length > 0, {
            message: 'At least one exercise is required',
        }),
    }),
});

export const deleteTrainingSchema = z.object({
    params: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    }),
});
