"use client";

import React, { useState, useEffect } from "react";


interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

interface TrainingSelectorProps {
    onTrainingAdded?: (training: TrainingEntry) => void;
    onCancel?: () => void;
}

interface TrainingData {
    [key: string]: number;
}

const TrainingSelector: React.FC<TrainingSelectorProps> = ({ onTrainingAdded, onCancel }) => {
    const [trainingData, setTrainingData] = useState<TrainingData>({});
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [exerciseCategories, setExerciseCategories] = useState<{ category: string; exercises: string[] }[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/exercises")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch exercises");
                return res.json();
            })
            .then(data => {
                setExerciseCategories(data);
                if (data.length > 0) setActiveCategory(data[0].category);
                setLoading(false);
            })
            .catch(err => {
                setError("Failed to fetch exercises");
                setLoading(false);
            });
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

            // Get the token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated. Please log in again.');
            }

            const response = await fetch("/api/trainings", {
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
            onTrainingAdded?.(savedTraining);
        } catch (error) {
            console.error("Error saving training:", error);
            alert(error instanceof Error ? error.message : "Failed to save training. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const exercisesAdded = Object.values(trainingData).filter((val): val is number => val > 0).length;

    return (
        <div className="min-h-screen bg-[#080b14] overflow-x-hidden py-8">
            <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-[#0f172a] rounded-[32px] shadow-[0_0_50px_0_rgba(8,_112,_184,_0.7)] border border-blue-500/10 backdrop-blur-xl p-8">
                        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-8">
                            Add Training Session
                        </h2>
                        {loading && (
                            <div className="text-blue-200 text-center py-8">Loading exercises...</div>
                        )}
                        {error && (
                            <div className="text-red-500 text-center py-8">{error}</div>
                        )}
                        {!loading && !error && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
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

                            <div className="flex flex-wrap gap-2">
                                {exerciseCategories.map((category) => (
                                    <button
                                        key={category.category}
                                        onClick={() => setActiveCategory(category.category)}
                                        className={`px-4 py-2 rounded-xl text-lg transition-all duration-200 ${
                                            activeCategory === category.category
                                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                : "bg-[#1a2234] text-blue-200 border border-blue-500/10 hover:border-blue-500/30"
                                        }`}
                                    >
                                        {category.category}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-[#1a2234] rounded-xl border border-blue-500/10 p-6">
                                <h3 className="text-xl font-bold text-white mb-4">
                                    {activeCategory} Exercises
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {exerciseCategories
                                        .find((cat) => cat.category === activeCategory)
                                        ?.exercises.map((exercise) => (
                                            <div key={exercise} className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                                                <label className="block text-blue-200 mb-2">
                                                    {exercise}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    pattern="\d*"
                                                    value={trainingData[exercise] || ""}
                                                    onChange={(e) => handleExerciseChange(exercise, Math.round(Number(e.target.value)))}
                                                    placeholder="Weight (kg)"
                                                    className="w-full px-4 py-2 text-lg border border-blue-500/10 rounded-lg bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleSaveTraining}
                                    disabled={isSubmitting}
                                    className={`flex-1 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-400 transition-all duration-200 shadow-lg shadow-blue-500/20 ${
                                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300'
                                    }`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Training'}
                                </button>
                                <button
                                    onClick={onCancel}
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 text-xl font-bold text-blue-200 bg-[#1a2234] rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-200"
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