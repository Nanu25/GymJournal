"use strict";
// import { Request, Response } from 'express';
// import { trainings, getAllTrainings, createTraining, deleteTraining, updateTrainingByDate } from '../controllers/TrainingController';
// const mockResponse = () => {
//     const res: any = {};
//     res.status = jest.fn().mockReturnValue(res);
//     res.json = jest.fn().mockReturnValue(res);
//     return res;
// };
// describe('Training Controller', () => {
//     beforeEach(() => {
//         trainings.length = 0; // Clear the array
//         trainings.push(
//             { date: "2023-01-01", exercises: { "Bench Press": 100, "Squat": 150 } },
//             { date: "2023-01-02", exercises: { "Deadlift": 200 } },
//             { date: "2023-01-03", exercises: { "Bench Press": 105, "Squat": 155, "Deadlift": 210 } }
//         );
//     });
//     describe('getAllTrainings', () => {
//         test('should return all trainings when no query parameters are provided', () => {
//             const req: Partial<Request> = { query: {} };
//             const res = mockResponse();
//             getAllTrainings(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith(trainings);
//         });
//         test('should filter trainings by date', () => {
//             const req: Partial<Request> = { query: { searchTerm: '01-01' } };
//             const res = mockResponse();
//             getAllTrainings(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith([trainings[0]]);
//         });
//         test('should filter trainings by exercise name', () => {
//             const req: Partial<Request> = { query: { searchTerm: 'bench' } };
//             const res = mockResponse();
//             getAllTrainings(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith([trainings[0], trainings[2]]);
//         });
//         test('should sort trainings by date descending', () => {
//             const req: Partial<Request> = { query: { sortField: 'date', sortDirection: 'desc' } };
//             const res = mockResponse();
//             getAllTrainings(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith([trainings[2], trainings[1], trainings[0]]);
//         });
//         test('should sort trainings by pr ascending', () => {
//             const req: Partial<Request> = { query: { sortField: 'pr', sortDirection: 'asc' } };
//             const res = mockResponse();
//             getAllTrainings(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith([trainings[0], trainings[1], trainings[2]]);
//         });
//         test('should sort trainings by number of exercises ascending', () => {
//             const req: Partial<Request> = { query: { sortField: 'exercises', sortDirection: 'asc' } };
//             const res = mockResponse();
//             getAllTrainings(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith([trainings[1], trainings[0], trainings[2]]);
//         });
//     });
//     describe('createTraining', () => {
//         test('should add a new training when valid data is provided', () => {
//             const req: Partial<Request> = { body: { date: "2023-01-04", exercises: { "Overhead Press": 80 } } };
//             const res = mockResponse();
//             createTraining(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(201);
//             expect(res.json).toHaveBeenCalledWith({ date: "2023-01-04", exercises: { "Overhead Press": 80 } });
//             expect(trainings).toHaveLength(4);
//             expect(trainings[3]).toEqual({ date: "2023-01-04", exercises: { "Overhead Press": 80 } });
//         });
//         test('should return 400 when date is missing', () => {
//             const req: Partial<Request> = { body: { exercises: { "Overhead Press": 80 } } };
//             const res = mockResponse();
//             createTraining(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(400);
//             expect(res.json).toHaveBeenCalledWith({ message: 'Date and at least one exercise are required' });
//             expect(trainings).toHaveLength(3);
//         });
//         test('should return 400 when exercises are missing', () => {
//             const req: Partial<Request> = { body: { date: "2023-01-04" } };
//             const res = mockResponse();
//             createTraining(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(400);
//             expect(res.json).toHaveBeenCalledWith({ message: 'Date and at least one exercise are required' });
//             expect(trainings).toHaveLength(3);
//         });
//         test('should return 400 when exercises are empty', () => {
//             const req: Partial<Request> = { body: { date: "2023-01-04", exercises: {} } };
//             const res = mockResponse();
//             createTraining(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(400);
//             expect(res.json).toHaveBeenCalledWith({ message: 'Date and at least one exercise are required' });
//             expect(trainings).toHaveLength(3);
//         });
//     });
//     describe('deleteTraining', () => {
//         test('should delete the training with the specified date', () => {
//             const req: Partial<Request> = { params: { date: "2023-01-02" } };
//             const res = mockResponse();
//             deleteTraining(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith({ message: 'Training deleted', deletedTraining: { date: "2023-01-02", exercises: { "Deadlift": 200 } } });
//             expect(trainings).toHaveLength(2);
//             expect(trainings.some(t => t.date === "2023-01-02")).toBe(false);
//         });
//         test('should return 404 when the date does not exist', () => {
//             const req: Partial<Request> = { params: { date: "2023-01-04" } };
//             const res = mockResponse();
//             deleteTraining(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(404);
//             expect(res.json).toHaveBeenCalledWith({ message: 'Training not found' });
//             expect(trainings).toHaveLength(3);
//         });
//     });
//     describe('updateTrainingByDate', () => {
//         test('should update the exercises for the specified date', () => {
//             const req: Partial<Request> = { params: { date: "2023-01-01" }, body: { exercises: { "Bench Press": 110, "Squat": 160 } } };
//             const res = mockResponse();
//             updateTrainingByDate(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(200);
//             expect(res.json).toHaveBeenCalledWith({ date: "2023-01-01", exercises: { "Bench Press": 110, "Squat": 160 } });
//             expect(trainings[0].exercises).toEqual({ "Bench Press": 110, "Squat": 160 });
//         });
//         test('should return 404 when the date does not exist', () => {
//             const req: Partial<Request> = { params: { date: "2023-01-04" }, body: { exercises: { "Overhead Press": 80 } } };
//             const res = mockResponse();
//             updateTrainingByDate(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(404);
//             expect(res.json).toHaveBeenCalledWith({ message: 'Training not found' });
//         });
//         test('should return 400 when exercises are missing', () => {
//             const req: Partial<Request> = { params: { date: "2023-01-01" }, body: {} };
//             const res = mockResponse();
//             updateTrainingByDate(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(400);
//             expect(res.json).toHaveBeenCalledWith({ message: 'At least one exercise is required' });
//         });
//         test('should return 400 when exercises are empty', () => {
//             const req: Partial<Request> = { params: { date: "2023-01-01" }, body: { exercises: {} } };
//             const res = mockResponse();
//             updateTrainingByDate(req as Request, res as Response);
//             expect(res.status).toHaveBeenCalledWith(400);
//             expect(res.json).toHaveBeenCalledWith({ message: 'At least one exercise is required' });
//         });
//     });
// });
