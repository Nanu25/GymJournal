import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';

interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

interface TrainingSelectorProps {
    onTrainingAdded: (training: TrainingEntry) => void;
    onCancel?: () => void;
}

interface TrainingData {
    [key: string]: number;
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



const TrainingSelector: React.FC<TrainingSelectorProps> = ({ onTrainingAdded, onCancel }) => {
    const [trainingData, setTrainingData] = useState<TrainingData>({});
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [exerciseCategories, setExerciseCategories] = useState<{ category: string; exercises: string[] }[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [exerciseStats, setExerciseStats] = useState<{ count: number, categories: number } | null>(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${API_BASE_URL}/exercises`, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch exercises: ${response.status} ${response.statusText}`);
                }

                // Parse the response as the new format
                const rawData = await response.json();

                // Handle both old and new response formats
                let exerciseData;
                let exerciseCount = 0;
                let categoriesCount = 0;

                if ('source' in rawData && 'data' in rawData) {
                    // New format with metadata
                    exerciseCount = rawData.count;
                    categoriesCount = rawData.categories;
                    exerciseData = rawData.data;
                } else if (Array.isArray(rawData)) {
                    // Old format (direct array)
                    exerciseData = rawData;
                    exerciseCount = rawData.reduce((total, cat) => total + cat.exercises.length, 0);
                    categoriesCount = rawData.length;
                } else {
                    throw new Error('Invalid response format from server');
                }

                // Update state based on the data
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
                setError("Failed to fetch exercises from server. Using default exercise list.");

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
                alert('Please add at least one exercise with weight greater than 0');
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

            // Call onTrainingAdded to trigger navigation back to dashboard
            if (onTrainingAdded) {
                onTrainingAdded(savedTraining);
            } else {
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Error saving training:", error);
            alert(error instanceof Error ? error.message : "Failed to save training. Please try again.");
            setIsSubmitting(false);
        }
    };

    const exercisesAdded = Object.values(trainingData).filter((val): val is number => val > 0).length;

    const [searchTerm, setSearchTerm] = useState("");

    // Filter exercises based on search term or active category
    const displayedExercises = React.useMemo(() => {
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

    return (
        <div className="min-h-screen bg-[#080b14] overflow-x-hidden py-8">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-[#0f172a] rounded-[32px] shadow-[0_0_50px_0_rgba(8,_112,_184,_0.7)] border border-blue-500/10 backdrop-blur-xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            {/* Back button removed as it is replaced by Global Navbar */}
                        </div>
                        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-8">
                            Add Training Session
                        </h2>

                        {/* Exercise stats indicator */}
                        <div className="text-center text-sm mb-4 py-1 px-3 rounded-full inline-block mx-auto bg-blue-100 text-blue-800 border border-blue-300">
                            {loading ? 'Loading exercises...' :
                                `${exerciseStats?.count || 0} exercises in ${exerciseStats?.categories || 0} categories`}
                        </div>

                        {loading && (
                            <div className="text-blue-200 text-center py-8">Loading exercises...</div>
                        )}
                        {error && (
                            <div className="text-red-500 text-center py-8">{error}</div>
                        )}
                        {!loading && !error && (
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="flex-1">
                                        <label className="block text-blue-200 mb-2 text-lg">
                                            Training Date
                                        </label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                            className="w-full px-6 py-4 text-lg border border-blue-500/10 rounded-xl bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                                        />
                                    </div>
                                    <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-500/30 p-4 text-center">
                                        <p className="text-emerald-200 text-sm font-medium">Exercises Added</p>
                                        <p className="text-3xl font-bold text-white mt-1">{exercisesAdded}</p>
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search for an exercise..."
                                        className="w-full pl-12 pr-4 py-4 text-lg border border-blue-500/10 rounded-xl bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 placeholder-blue-200/30"
                                    />
                                </div>

                                {!searchTerm && (
                                    <div className="flex flex-wrap gap-2">
                                        {exerciseCategories.map((category) => (
                                            <button
                                                key={category.category}
                                                onClick={() => setActiveCategory(category.category)}
                                                className={`px-4 py-2 rounded-xl text-lg transition-all duration-200 ${activeCategory === category.category
                                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                    : "bg-[#1a2234] text-blue-200 border border-blue-500/10 hover:border-blue-500/30"
                                                    }`}
                                            >
                                                {category.category}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="bg-[#1a2234] rounded-xl border border-blue-500/10 p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">
                                        {searchTerm ? `Search Results (${displayedExercises.length})` : `${activeCategory} Exercises`}
                                    </h3>
                                    {displayedExercises.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {displayedExercises.map((exercise) => (
                                                <div key={`${exercise.category}-${exercise.name}`} className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="block text-blue-200">
                                                            {exercise.name}
                                                        </label>
                                                        {searchTerm && (
                                                            <span className="text-xs text-blue-400/70 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                                                                {exercise.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        pattern="\d*"
                                                        value={trainingData[exercise.name] || ""}
                                                        onChange={(e) => handleExerciseChange(exercise.name, Math.round(Number(e.target.value)))}
                                                        placeholder="kg/min"
                                                        className="w-full px-4 py-2 text-lg border border-blue-500/10 rounded-lg bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-blue-200/50">
                                            {searchTerm ? "No exercises found matching your search." : "No exercises available in this category."}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleSaveTraining}
                                        disabled={isSubmitting}
                                        className={`flex-1 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-400 transition-all duration-200 shadow-lg shadow-blue-500/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300'
                                            }`}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Training'}
                                    </button>
                                    <button
                                        onClick={onCancel}
                                        disabled={isSubmitting}
                                        className={`flex-1 py-4 text-xl font-bold text-white bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl border border-gray-500/50 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg shadow-gray-500/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingSelector;