import { useState, useMemo, useEffect } from 'react';
import { useExercises, useTrainingMutations } from './useTrainings';
import { TrainingEntry } from '../services/trainingService';
import toast from 'react-hot-toast';



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
    // TanStack Query Hooks
    const { data: fetchedCategories = [], isLoading: loadingExercises, error: exercisesError } = useExercises();
    const { createTraining } = useTrainingMutations();

    // Form State
    const [trainingData, setTrainingData] = useState<TrainingData>({});
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");

    // Determine categories to use (fetched or default)
    const exerciseCategories = useMemo(() => {
        return fetchedCategories.length > 0 ? fetchedCategories : DEFAULT_EXERCISE_CATEGORIES;
    }, [fetchedCategories]);

    // Set initial active category
    useEffect(() => {
        if (exerciseCategories.length > 0 && !activeCategory) {
            setActiveCategory(exerciseCategories[0].category);
        }
    }, [exerciseCategories, activeCategory]);

    // Derived Stats
    const exerciseStats = useMemo(() => {
        const count = exerciseCategories.reduce((total: number, cat: any) => total + cat.exercises.length, 0);
        const categories = exerciseCategories.length;
        return { count, categories };
    }, [exerciseCategories]);

    const handleExerciseChange = (exercise: string, value: number) => {
        setTrainingData(prev => ({
            ...prev,
            [exercise]: value,
        }));
    };

    const handleSaveTraining = async () => {
        if (createTraining.isPending) return;

        const filteredData = Object.entries(trainingData)
            .filter(([_, value]) => value > 0)
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {} as { [key: string]: number });

        if (Object.keys(filteredData).length === 0) {
            toast.error('Please add at least one exercise with weight greater than 0');
            return;
        }

        try {
            const newTraining = { date, exercises: filteredData };
            await createTraining.mutateAsync(newTraining);

            // Call onTrainingAdded to trigger navigation back to dashboard
            if (onTrainingAdded) {
                onTrainingAdded(newTraining);
            }
        } catch (error) {
            // Error is handled by mutation onError
            console.error("Error saving training:", error);
        }
    };

    const exercisesAdded = Object.values(trainingData).filter((val): val is number => val > 0).length;

    // Filter exercises based on search term or active category
    const displayedExercises = useMemo(() => {
        if (!searchTerm.trim()) {
            return exerciseCategories
                .find((cat: any) => cat.category === activeCategory)
                ?.exercises.map((name: string) => ({ name, category: activeCategory })) || [];
        }

        const term = searchTerm.toLowerCase();
        return exerciseCategories.flatMap((cat: any) =>
            cat.exercises
                .filter((ex: string) => ex.toLowerCase().includes(term))
                .map((name: string) => ({ name, category: cat.category }))
        );
    }, [searchTerm, activeCategory, exerciseCategories]);

    return {
        trainingData,
        date,
        setDate,
        exerciseCategories,
        activeCategory,
        setActiveCategory,
        isSubmitting: createTraining.isPending,
        loading: loadingExercises,
        error: exercisesError ? (exercisesError as Error).message : null,
        exerciseStats,
        searchTerm,
        setSearchTerm,
        handleExerciseChange,
        handleSaveTraining,
        exercisesAdded,
        displayedExercises
    };
};
