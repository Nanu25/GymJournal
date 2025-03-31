"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const trainingroutes_1 = __importDefault(require("./routes/trainingroutes")); // Your existing routes
const userroutes_1 = __importDefault(require("./routes/userroutes")); // New routes
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Respect CORS requirement
app.use(express_1.default.json()); // Parse JSON bodies
// Routes
app.use('/api/trainings', trainingroutes_1.default);
app.use('/api/user', userroutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
