import { useState, useEffect, useMemo } from 'react';
import { trainingService } from '../services/trainingService';
import { API_BASE_URL } from '../config';
import toast from 'react-hot-toast';

export interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

interface TrainingData {
    [key: string]: number;
}

interface UseTrainingFormProps {
    onTrainingAdded?: (training: TrainingEntry) => void;
}

// Default exercise categories to use as fallback
const DEFAULT_EXERCISE_CATEGORIES = [
    {
        category: 'Chest',
        exercises: ['Bench Press', 'Incline Press', 'Decline Press', 'Chest Fly', 'Push-ups']
    },
    {
        category: 'Back',
        exercises: ['Pull-ups', 'Lat Pulldown', 'Deadlift', 'Bent Over Row', 'T-Bar Row']
    },
    {
        category: 'Legs',
        exercises: ['Squat', 'Leg Press', 'Lunges', 'Leg Extension', 'Leg Curl', 'Calf Raise']
    },
    {
        category: 'Shoulders',
        exercises: ['Overhead Press', 'Lateral Raise', 'Front Raise', 'Reverse Fly', 'Shrugs']
    },
    {
        category: 'Arms',
        exercises: ['Bicep Curl', 'Tricep Extension', 'Hammer Curl', 'Skull Crusher', 'Chin-ups']
    },
    {
        category: 'Core',
        exercises: ['Crunches', 'Leg Raises', 'Plank', 'Russian Twist', 'Ab Wheel Rollout']
    }
];

export const useTrainingForm = ({ onTrainingAdded }: UseTrainingFormProps = {}) => {
    const [trainingData, setTrainingData] = useState<TrainingData>({});
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [exerciseCategories, setExerciseCategories] = useState<{ category: string; exercises: string[] }[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exerciseStats, setExerciseStats] = useState<{ count: number, categories: number } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);
                const exerciseData = await trainingService.getExercises();

                // Update state based on the data
                const exerciseCount = exerciseData.reduce((total, cat) => total + cat.exercises.length, 0);
                const categoriesCount = exerciseData.length;

                setExerciseStats({
                    count: exerciseCount,
                    categories: categoriesCount
                });

                if (exerciseData.length > 0) {
                    setExerciseCategories(exerciseData);
                    setActiveCategory(exerciseData[0].category);
                    setError(null);
                } else {
                    throw new Error('No exercise categories received');
                }
            } catch (err) {
                console.error('Error fetching exercises from API:', err);
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(`Failed to fetch exercises: ${errorMessage}. Using default list.`);

                // Use default exercise categories as fallback
                setExerciseCategories(DEFAULT_EXERCISE_CATEGORIES);
                if (DEFAULT_EXERCISE_CATEGORIES.length > 0) {
                    setActiveCategory(DEFAULT_EXERCISE_CATEGORIES[0].category);
                }

                setExerciseStats({
                    count: DEFAULT_EXERCISE_CATEGORIES.reduce((total, cat) => total + cat.exercises.length, 0),
                    categories: DEFAULT_EXERCISE_CATEGORIES.length
                });
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    const handleExerciseChange = (exercise: string, value: number) => {
        setTrainingData(prev => ({
            ...prev,
            [exercise]: value,
        }));
    };

    const handleSaveTraining = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const filteredData = Object.entries(trainingData)
                .filter(([_, value]) => value > 0)
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {} as { [key: string]: number });

            if (Object.keys(filteredData).length === 0) {
                toast.error('Please add at least one exercise with weight greater than 0');
                setIsSubmitting(false);
                return;
            }

            const trainingEntry: TrainingEntry = {
                date,
                exercises: filteredData,
            };

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated. Please log in again.');
            }

            const response = await fetch(`${API_BASE_URL}/trainings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(trainingEntry),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save training");
            }

            const savedTraining = await response.json();
            toast.success('Training saved successfully!');

            // Call onTrainingAdded to trigger navigation back to dashboard
            if (onTrainingAdded) {
                onTrainingAdded(savedTraining);
            } else {
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error saving training:", error);
            toast.error(error instanceof Error ? error.message : "Failed to save training. Please try again.");
            setIsSubmitting(false);
        }
    };

    const exercisesAdded = Object.values(trainingData).filter((val): val is number => val > 0).length;

    // Filter exercises based on search term or active category
    const displayedExercises = useMemo(() => {
        if (!searchTerm.trim()) {
            return exerciseCategories
                .find((cat) => cat.category === activeCategory)
                ?.exercises.map(name => ({ name, category: activeCategory })) || [];
        }

        const term = searchTerm.toLowerCase();
        return exerciseCategories.flatMap(cat =>
            cat.exercises
                .filter(ex => ex.toLowerCase().includes(term))
                .map(name => ({ name, category: cat.category }))
        );
    }, [searchTerm, activeCategory, exerciseCategories]);

    return {
        trainingData,
        date,
        setDate,
        exerciseCategories,
        activeCategory,
        setActiveCategory,
        isSubmitting,
        loading,
        error,
        exerciseStats,
        searchTerm,
        setSearchTerm,
        handleExerciseChange,
        handleSaveTraining,
        exercisesAdded,
        displayedExercises
    };
};
