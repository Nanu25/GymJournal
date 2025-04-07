// src/components/OfflineTrainingSelector.tsx
import React, { useState, useEffect } from "react";

interface OfflineTrainingSelectorProps {
    onBackToDashboard: () => void;
    onSaveTraining?: (newTraining: any) => void;
}

const OfflineTrainingSelector: React.FC<OfflineTrainingSelectorProps> = ({
                                                                             onBackToDashboard,
                                                                             onSaveTraining
                                                                         }) => {
    const [date, setDate] = useState("");
    const [exerciseName, setExerciseName] = useState("");
    const [weight, setWeight] = useState("");
    const [localTrainings, setLocalTrainings] = useState<any[]>(() => {
        // Load from localStorage on init
        const saved = localStorage.getItem('offlineTrainings');
        return saved ? JSON.parse(saved) : [];
    });

    // Save to localStorage when trainings change
    useEffect(() => {
        localStorage.setItem('offlineTrainings', JSON.stringify(localTrainings));
    }, [localTrainings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newTraining = {
            date,
            exercises: {
                [exerciseName]: parseFloat(weight)
            }
        };

        // Add to local state
        setLocalTrainings([...localTrainings, newTraining]);

        // Notify parent component if callback provided
        if (onSaveTraining) {
            onSaveTraining(newTraining);
        }

        // Clear form
        setDate("");
        setExerciseName("");
        setWeight("");
    };

    return (
        <div className="p-5">
            <div className="bg-yellow-600 text-white p-2 mb-4 rounded">
                You are currently in offline mode. Trainings will be stored locally.
            </div>

            <h2 className="text-2xl text-white mb-4">Add New Training</h2>

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-white mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Exercise</label>
                        <input
                            type="text"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Add Training
                    </button>
                    <button
                        type="button"
                        onClick={onBackToDashboard}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </form>

            {/* Display local trainings */}
            {localTrainings.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl text-white mb-3">Your Trainings</h3>
                    <div className="bg-gray-800 rounded p-2">
                        {localTrainings.map((training, index) => (
                            <div key={index} className="p-3 mb-2 rounded bg-gray-700">
                                <div className="flex justify-between">
                                    <span className="text-white font-bold">{training.date}</span>
                                </div>
                                <div className="mt-1">
                                    {Object.entries(training.exercises).map(([exercise, weight], idx) => (
                                        <div key={idx} className="text-white">
                                            {exercise}: {weight} kg
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfflineTrainingSelector;