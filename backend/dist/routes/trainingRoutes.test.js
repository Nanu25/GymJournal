// "use strict";
// var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
//     function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
//     return new (P || (P = Promise))(function (resolve, reject) {
//         function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
//         function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
//         function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
//         step((generator = generator.apply(thisArg, _arguments || [])).next());
//     });
// };
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const supertest_1 = __importDefault(require("supertest"));
// const mongoose_1 = __importDefault(require("mongoose"));
// const express_1 = __importDefault(require("express"));
// const cors_1 = __importDefault(require("cors"));
// const trainingroutes_1 = __importDefault(require("./trainingroutes"));
// const Training_1 = require("../models/Training");
// // Create a test express app
// const app = (0, express_1.default)();
// app.use((0, cors_1.default)());
// app.use(express_1.default.json());
// app.use('/api/trainings', trainingroutes_1.default);
// // Connect to a test database before running tests
// beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
//     const testMongoUri = 'mongodb://localhost:27017/test-fitness-tracker';
//     yield mongoose_1.default.connect(testMongoUri);
// }));
// // Clear database before each test
// beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
//     yield Training_1.Training.deleteMany({});
// }));
// // Disconnect from database after tests
// afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
//     yield mongoose_1.default.connection.close();
// }));
// describe('Training Routes', () => {
//     // Test creating a training
//     test('POST /api/trainings should create a new training', () => __awaiter(void 0, void 0, void 0, function* () {
//         const trainingData = {
//             date: '2025-01-01',
//             exercises: {
//                 'Bench Press': 100,
//                 'Squat': 150
//             }
//         };
//         const response = yield (0, supertest_1.default)(app)
//             .post('/api/trainings')
//             .send(trainingData);
//         expect(response.statusCode).toBe(201);
//         expect(response.body.date).toBe(trainingData.date);
//         expect(response.body.exercises['Bench Press']).toBe(100);
//     }));
//     // Test getting all trainings
//     test('GET /api/trainings should return all trainings', () => __awaiter(void 0, void 0, void 0, function* () {
//         // First, create some test data
//         const trainingData = {
//             date: '2025-01-01',
//             exercises: {
//                 'Bench Press': 100,
//                 'Squat': 150
//             }
//         };
//         yield Training_1.Training.create(trainingData);
//         const response = yield (0, supertest_1.default)(app).get('/api/trainings');
//         expect(response.statusCode).toBe(200);
//         expect(response.body.length).toBe(1);
//         expect(response.body[0].date).toBe(trainingData.date);
//     }));
//     // Test deleting a training
//     test('DELETE /api/trainings/:id should delete a training', () => __awaiter(void 0, void 0, void 0, function* () {
//         // First, create a training to delete
//         const training = yield Training_1.Training.create({
//             date: '2025-01-01',
//             exercises: {
//                 'Bench Press': 100,
//                 'Squat': 150
//             }
//         });
//         const response = yield (0, supertest_1.default)(app).delete(`/api/trainings/${training._id}`);
//         expect(response.statusCode).toBe(200);
//         // Verify the training was actually deleted
//         const deletedTraining = yield Training_1.Training.findById(training._id);
//         expect(deletedTraining).toBeNull();
//     }));
//     // Test updating a training
//     test('PUT /api/trainings/:id should update a training', () => __awaiter(void 0, void 0, void 0, function* () {
//         // First, create a training to update
//         const training = yield Training_1.Training.create({
//             date: '2025-01-01',
//             exercises: {
//                 'Bench Press': 100,
//                 'Squat': 150
//             }
//         });
//         const updatedData = {
//             date: '2025-02-01',
//             exercises: {
//                 'Bench Press': 110,
//                 'Squat': 160
//             }
//         };
//         const response = yield (0, supertest_1.default)(app)
//             .put(`/api/trainings/${training._id}`)
//             .send(updatedData);
//         expect(response.statusCode).toBe(200);
//         expect(response.body.date).toBe(updatedData.date);
//         expect(response.body.exercises['Bench Press']).toBe(110);
//     }));
// });
