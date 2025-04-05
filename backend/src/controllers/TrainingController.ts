import { Request, Response } from 'express';
const mockTrainings = require("../data/mockTrainings.json");
const muscleGroupMappingData = require("../data/muscleGroupMappingData.json");

// Define the structure for TrainingEntry
interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

let trainings: TrainingEntry[] = mockTrainings; // Load mock data into the variable

export {trainings};
export const getAllTrainings = (req: Request, res: Response): void => {
    const { searchTerm, sortField, sortDirection, page = 1, limit = 3 } = req.query;

    let result = [...trainings];

    // Apply filtering
    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toString().toLowerCase();
        result = result.filter(training =>
            training.date.toLowerCase().includes(lowerSearchTerm) ||
            Object.keys(training.exercises).some(exercise =>
                exercise.toLowerCase().includes(lowerSearchTerm)
            )
        );
    }

    // Apply sorting
    if (sortField) {
        result.sort((a, b) => {
            let comparison = 0;
            if (sortField === "date") {
                comparison = a.date.localeCompare(b.date);
            } else if (sortField === "pr") {
                const prA = Object.values(a.exercises).length > 0 ? Math.max(...Object.values(a.exercises)) : 0;
                const prB = Object.values(b.exercises).length > 0 ? Math.max(...Object.values(b.exercises)) : 0;
                comparison = prA - prB;
            } else if (sortField === "exercises") {
                comparison = Object.keys(a.exercises).length - Object.keys(b.exercises).length;
            }
            return sortDirection === "asc" ? comparison : -comparison;
        });
    }

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedResult = result.slice(startIndex, endIndex);

    // Send response with paginated data and metadata
    res.status(200).json({
        trainings: paginatedResult,
        total: result.length, // Total number of items after filtering
        page: Number(page),
        limit: Number(limit)
    });
};

export const createTraining = (req: Request, res: Response): void => {
    const { date, exercises } = req.body;

    if (!date || !exercises) {
        res.status(400).json({ message: 'Date and exercises are required' });
        return;
    }

    const invalidExercises: string[] = [];

    Object.entries(exercises).forEach(([exercise, value]) => {
        if (isNaN(Number(value))) {
            invalidExercises.push(`${exercise} has non-numeric value`);
        }
        else if (Number(value) <= 0) {
            invalidExercises.push(`${exercise} has zero or negative value`);
        }
    });

    if (invalidExercises.length > 0) {
        res.status(400).json({
            message: 'Invalid exercise values detected',
            details: invalidExercises
        });
        return;
    }

    // Filter zero values if needed
    const filteredExercises = Object.entries(exercises)
        .filter(([_, value]) => Number(value) > 0)
        .reduce((acc, [key, value]) => {
            acc[key] = Number(value);
            return acc;
        }, {} as Record<string, number>);

    // Check if any exercises remain after filtering
    if (Object.keys(filteredExercises).length === 0) {
        res.status(400).json({ message: 'At least one exercise with positive value is required' });
        return;
    }

    const newTraining: TrainingEntry = {
        date,
        exercises: filteredExercises,
    };

    trainings.push(newTraining);
    res.status(201).json(newTraining);
};

export const deleteTraining = (req: Request, res: Response): void => {
    const decodedDate = decodeURIComponent(req.params.date);
    console.log('Backend received delete request for date:', decodedDate);

    console.log('Available training dates:', trainings.map(t => t.date));

    const trainingIndex = trainings.findIndex(t => t.date === decodedDate);
    console.log('Found at index:', trainingIndex);

    if (trainingIndex === -1) {
        // @ts-ignore
        return res.status(404).json({ message: 'Training not found' });
    }

    const deletedTraining = trainings.splice(trainingIndex, 1)[0];
    res.status(200).json({ message: 'Training deleted', deletedTraining });
};

// Update a training by date
export const updateTrainingByDate = (req: Request, res: Response): void => {
    const { date } = req.params;
    const { exercises } = req.body;

    // Find the training with the matching date
    const trainingIndex = trainings.findIndex(training => training.date === date);

    // Validate if the training exists
    if (trainingIndex === -1) {
        res.status(404).json({ message: 'Training not found' });
        return;
    }

    // Validate the request body
    if (!exercises || Object.keys(exercises).length === 0) {
        res.status(400).json({ message: 'At least one exercise is required' });
        return;
    }

    // Update the training with the new exercises
    trainings[trainingIndex] = { date, exercises };

    res.status(200).json(trainings[trainingIndex]);
};


const muscleGroupMapping = muscleGroupMappingData as { [key: string]: string };
export const getMuscleGroupDistribution = (req: Request, res: Response): void => {
    const muscleGroupCounts: { [key: string]: number } = {};

    trainings.forEach((training) => {
        Object.keys(training.exercises).forEach((exercise) => {
            const muscleGroup = muscleGroupMapping[exercise] || "Other";
            muscleGroupCounts[muscleGroup] = (muscleGroupCounts[muscleGroup] || 0) + 1;
        });
    });

    const data = Object.entries(muscleGroupCounts).map(([name, value]) => ({
        name,
        value,
    }));

    res.status(200).json(data);
};

export const getExerciseProgressData = (req: Request, res: Response): void => {
    const { exercise } = req.params;

    if (!exercise) {
        res.status(400).json({ message: 'Exercise name is required' });
        return;
    }

    // Filter trainings with the selected exercise, extract date and weight, and sort by date
    const progressData = trainings
        .filter((training) => exercise in training.exercises)
        .map((training) => ({
            date: training.date,
            weight: training.exercises[exercise],
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    res.status(200).json(progressData);
};

export const getTotalWeightPerSession = (req: Request, res: Response): void => {
    const data = trainings
        .map((training) => ({
            date: training.date,
            totalWeight: Object.values(training.exercises).reduce(
                (sum, weight) => sum + weight,
                0
            ),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    res.status(200).json(data);
};

// Get unique exercises for dropdown
export const getUniqueExercises = (req: Request, res: Response): void => {
    const allExercises = new Set<string>();

    trainings.forEach((training) => {
        Object.keys(training.exercises).forEach((exercise) =>
            allExercises.add(exercise)
        );
    });

    const exerciseList = Array.from(allExercises);
    res.status(200).json(exerciseList);
};