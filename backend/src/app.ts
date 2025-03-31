import express from 'express';
import cors from 'cors';
import trainingRoutes from './routes/trainingroutes'; // Your existing routes
import userRoutes from './routes/userroutes'; // New routes

const app = express();

// Middleware
app.use(cors()); // Respect CORS requirement
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/trainings', trainingRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});