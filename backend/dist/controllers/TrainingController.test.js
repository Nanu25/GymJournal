"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TrainingController_1 = require("../controllers/TrainingController");
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('Training Controller', () => {
    beforeEach(() => {
        TrainingController_1.trainings.length = 0; // Clear the array
        TrainingController_1.trainings.push({ date: "2023-01-01", exercises: { "Bench Press": 100, "Squat": 150 } }, { date: "2023-01-02", exercises: { "Deadlift": 200 } }, { date: "2023-01-03", exercises: { "Bench Press": 105, "Squat": 155, "Deadlift": 210 } });
    });
    describe('getAllTrainings', () => {
        test('should return all trainings when no query parameters are provided', () => {
            const req = { query: {} };
            const res = mockResponse();
            (0, TrainingController_1.getAllTrainings)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(TrainingController_1.trainings);
        });
        test('should filter trainings by date', () => {
            const req = { query: { searchTerm: '01-01' } };
            const res = mockResponse();
            (0, TrainingController_1.getAllTrainings)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([TrainingController_1.trainings[0]]);
        });
        test('should filter trainings by exercise name', () => {
            const req = { query: { searchTerm: 'bench' } };
            const res = mockResponse();
            (0, TrainingController_1.getAllTrainings)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([TrainingController_1.trainings[0], TrainingController_1.trainings[2]]);
        });
        test('should sort trainings by date descending', () => {
            const req = { query: { sortField: 'date', sortDirection: 'desc' } };
            const res = mockResponse();
            (0, TrainingController_1.getAllTrainings)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([TrainingController_1.trainings[2], TrainingController_1.trainings[1], TrainingController_1.trainings[0]]);
        });
        test('should sort trainings by pr ascending', () => {
            const req = { query: { sortField: 'pr', sortDirection: 'asc' } };
            const res = mockResponse();
            (0, TrainingController_1.getAllTrainings)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([TrainingController_1.trainings[0], TrainingController_1.trainings[1], TrainingController_1.trainings[2]]);
        });
        test('should sort trainings by number of exercises ascending', () => {
            const req = { query: { sortField: 'exercises', sortDirection: 'asc' } };
            const res = mockResponse();
            (0, TrainingController_1.getAllTrainings)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([TrainingController_1.trainings[1], TrainingController_1.trainings[0], TrainingController_1.trainings[2]]);
        });
    });
    describe('createTraining', () => {
        test('should add a new training when valid data is provided', () => {
            const req = { body: { date: "2023-01-04", exercises: { "Overhead Press": 80 } } };
            const res = mockResponse();
            (0, TrainingController_1.createTraining)(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ date: "2023-01-04", exercises: { "Overhead Press": 80 } });
            expect(TrainingController_1.trainings).toHaveLength(4);
            expect(TrainingController_1.trainings[3]).toEqual({ date: "2023-01-04", exercises: { "Overhead Press": 80 } });
        });
        test('should return 400 when date is missing', () => {
            const req = { body: { exercises: { "Overhead Press": 80 } } };
            const res = mockResponse();
            (0, TrainingController_1.createTraining)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Date and at least one exercise are required' });
            expect(TrainingController_1.trainings).toHaveLength(3);
        });
        test('should return 400 when exercises are missing', () => {
            const req = { body: { date: "2023-01-04" } };
            const res = mockResponse();
            (0, TrainingController_1.createTraining)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Date and at least one exercise are required' });
            expect(TrainingController_1.trainings).toHaveLength(3);
        });
        test('should return 400 when exercises are empty', () => {
            const req = { body: { date: "2023-01-04", exercises: {} } };
            const res = mockResponse();
            (0, TrainingController_1.createTraining)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Date and at least one exercise are required' });
            expect(TrainingController_1.trainings).toHaveLength(3);
        });
    });
    describe('deleteTraining', () => {
        test('should delete the training with the specified date', () => {
            const req = { params: { date: "2023-01-02" } };
            const res = mockResponse();
            (0, TrainingController_1.deleteTraining)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Training deleted', deletedTraining: { date: "2023-01-02", exercises: { "Deadlift": 200 } } });
            expect(TrainingController_1.trainings).toHaveLength(2);
            expect(TrainingController_1.trainings.some(t => t.date === "2023-01-02")).toBe(false);
        });
        test('should return 404 when the date does not exist', () => {
            const req = { params: { date: "2023-01-04" } };
            const res = mockResponse();
            (0, TrainingController_1.deleteTraining)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Training not found' });
            expect(TrainingController_1.trainings).toHaveLength(3);
        });
    });
    describe('updateTrainingByDate', () => {
        test('should update the exercises for the specified date', () => {
            const req = { params: { date: "2023-01-01" }, body: { exercises: { "Bench Press": 110, "Squat": 160 } } };
            const res = mockResponse();
            (0, TrainingController_1.updateTrainingByDate)(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ date: "2023-01-01", exercises: { "Bench Press": 110, "Squat": 160 } });
            expect(TrainingController_1.trainings[0].exercises).toEqual({ "Bench Press": 110, "Squat": 160 });
        });
        test('should return 404 when the date does not exist', () => {
            const req = { params: { date: "2023-01-04" }, body: { exercises: { "Overhead Press": 80 } } };
            const res = mockResponse();
            (0, TrainingController_1.updateTrainingByDate)(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Training not found' });
        });
        test('should return 400 when exercises are missing', () => {
            const req = { params: { date: "2023-01-01" }, body: {} };
            const res = mockResponse();
            (0, TrainingController_1.updateTrainingByDate)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'At least one exercise is required' });
        });
        test('should return 400 when exercises are empty', () => {
            const req = { params: { date: "2023-01-01" }, body: { exercises: {} } };
            const res = mockResponse();
            (0, TrainingController_1.updateTrainingByDate)(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'At least one exercise is required' });
        });
    });
});
