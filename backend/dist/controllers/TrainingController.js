"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueExercises = exports.getTotalWeightPerSession = exports.getExerciseProgressData = exports.getMuscleGroupDistribution = exports.updateTrainingByDate = exports.deleteTraining = exports.createTraining = exports.getAllTrainings = exports.trainings = exports.generateMockTrainings = void 0;
// Generate mock training data
const generateMockTrainings = () => {
    const dates = ["2025-01-10", "2025-01-20", "2025-01-25", "2025-02-07", "2025-02-09", "2025-02-10", "2025-02-14", "2025-02-26"];
    return [
        {
            date: dates[0],
            exercises: {
                "Dumbbell Press": 3,
                "Incline Dumbbell": 25,
                "Dumbbell Flys": 18,
                "Biceps Curl": 30,
                "Cable Triceps Pushdown": 25,
                "Overhead triceps": 15
            }
        },
        {
            date: dates[1],
            exercises: {
                "Squats": 85,
                "Leg Curl": 60,
                "Calf Raises": 120,
                "Leg Extensions": 55,
                "Leg Press": 140
            }
        },
        {
            date: dates[2],
            exercises: {
                "Pullup": 15,
                "Dumbbell Row": 24,
                "Cable Row": 60,
                "Lat Pulldown": 55,
                "Deadlift": 100,
                "Face Pulls": 20
            }
        },
        {
            date: dates[3],
            exercises: {
                "Squats": 80,
                "Dumbbell Press": 28,
                "Pullup": 12,
                "Biceps Curl": 15,
                "Calf Raises": 110,
                "Cable Triceps Pushdown": 22
            }
        },
        {
            date: dates[4],
            exercises: {
                "Deadlift": 110,
                "Squats": 90,
                "Dumbbell Press": 32,
                "Dumbbell Row": 26,
                "Overhead Press": 40
            }
        },
        {
            date: dates[5],
            exercises: {
                "Dumbbell Press": 35,
                "Incline Dumbbell": 30,
                "Dumbbell Flys": 20,
                "Chest Press": 60,
                "Push-ups": 25
            }
        },
        {
            date: dates[6],
            exercises: {
                "Dumbbell Press": 40,
                "Incline Dumbbell": 35,
                "Dumbbell Flys": 25,
                "Biceps Curl": 35
            }
        },
        {
            date: dates[7],
            exercises: {
                "Dumbbell Press": 45,
                "Incline Dumbbell": 40,
                "Dumbbell Flys": 30,
                "Chest Press": 70,
                "Push-ups": 30,
                "Biceps Curl": 40,
                "Triceps Pushdown": 30
            }
        }
    ];
};
exports.generateMockTrainings = generateMockTrainings;
// Initialize the trainings array with mock data
let trainings = generateMockTrainings();
exports.trainings = trainings;
const getAllTrainings = (req, res) => {
    const { searchTerm, sortField, sortDirection } = req.query;
    let result = [...trainings];
    // Apply filtering
    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toString().toLowerCase();
        result = result.filter(training => training.date.toLowerCase().includes(lowerSearchTerm) ||
            Object.keys(training.exercises).some(exercise => exercise.toLowerCase().includes(lowerSearchTerm)));
    }
    // Apply sorting
    if (sortField) {
        result.sort((a, b) => {
            let comparison = 0;
            if (sortField === "date") {
                comparison = a.date.localeCompare(b.date);
            }
            else if (sortField === "pr") {
                const prA = Object.values(a.exercises).length > 0 ? Math.max(...Object.values(a.exercises)) : 0;
                const prB = Object.values(b.exercises).length > 0 ? Math.max(...Object.values(b.exercises)) : 0;
                comparison = prA - prB;
            }
            else if (sortField === "exercises") {
                comparison = Object.keys(a.exercises).length - Object.keys(b.exercises).length;
            }
            return sortDirection === "asc" ? comparison : -comparison;
        });
    }
    res.status(200).json(result);
};
exports.getAllTrainings = getAllTrainings;
const getMaxExercise = (training) => {
    return Object.entries(training.exercises).reduce((a, b) => (a[1] > b[1] ? a : b), ["", 0]);
};
// Create a new training
const createTraining = (req, res) => {
    const { date, exercises } = req.body;
    if (!date || !exercises || Object.keys(exercises).length === 0) {
        res.status(400).json({ message: 'Date and at least one exercise are required' });
        return;
    }
    const newTraining = {
        date,
        exercises,
    };
    trainings.push(newTraining);
    res.status(201).json(newTraining);
};
exports.createTraining = createTraining;
const deleteTraining = (req, res) => {
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
exports.deleteTraining = deleteTraining;
// Update a training by date
const updateTrainingByDate = (req, res) => {
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
exports.updateTrainingByDate = updateTrainingByDate;
const muscleGroupMapping = {
    "Bench Press": "Chest",
    "Dumbbell Press": "Chest",
    "Dumbbell Flys": "Chest",
    "Incline Dumbbell": "Chest",
    "Chest Press": "Chest",
    "Deadlift": "Back",
    "Lat Pulldown": "Back",
    "Pullup": "Back",
    "Dumbbell Row": "Back",
    "Cable Row": "Back",
    "Back Extensions": "Back",
    "Shoulder Press": "Shoulders",
    "Lateral Raise": "Shoulders",
    "Front Raise": "Shoulders",
    "Shrugs": "Shoulders",
    "Face Pulls": "Shoulders",
    "Squat": "Legs",
    "Leg Press": "Legs",
    "Leg Curl": "Legs",
    "Calf Raise": "Legs",
    "Lunges": "Legs",
    "Cable Triceps Pushdown": "Arms",
    "Hammer Curls": "Arms",
    "Dips": "Arms",
    "Biceps Curl": "Arms",
    "Overhead Triceps": "Arms"
};
// Backend function to get muscle group distribution data
const getMuscleGroupDistribution = (req, res) => {
    const muscleGroupCounts = {};
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
exports.getMuscleGroupDistribution = getMuscleGroupDistribution;
const getExerciseProgressData = (req, res) => {
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
exports.getExerciseProgressData = getExerciseProgressData;
// Get total weight per session for bar chart
const getTotalWeightPerSession = (req, res) => {
    const data = trainings
        .map((training) => ({
        date: training.date,
        totalWeight: Object.values(training.exercises).reduce((sum, weight) => sum + weight, 0),
    }))
        .sort((a, b) => a.date.localeCompare(b.date));
    res.status(200).json(data);
};
exports.getTotalWeightPerSession = getTotalWeightPerSession;
// Get unique exercises for dropdown
const getUniqueExercises = (req, res) => {
    const allExercises = new Set();
    trainings.forEach((training) => {
        Object.keys(training.exercises).forEach((exercise) => allExercises.add(exercise));
    });
    const exerciseList = Array.from(allExercises);
    res.status(200).json(exerciseList);
};
exports.getUniqueExercises = getUniqueExercises;
