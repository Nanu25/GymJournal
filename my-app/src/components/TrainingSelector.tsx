import React from "react";
import TrainingFormHeader from "./TrainingFormHeader";
import ExerciseCategoryFilter from "./ExerciseCategoryFilter";
import ExerciseGrid from "./ExerciseGrid";
import { useTrainingForm, TrainingEntry } from "../hooks/useTrainingForm";

interface TrainingSelectorProps {
    onTrainingAdded: (training: TrainingEntry) => void;
    onCancel?: () => void;
}

const TrainingSelector: React.FC<TrainingSelectorProps> = ({ onTrainingAdded, onCancel }) => {
    const {
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
    } = useTrainingForm({ onTrainingAdded });

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
                                <TrainingFormHeader
                                    date={date}
                                    setDate={setDate}
                                    exercisesAdded={exercisesAdded}
                                />

                                <ExerciseCategoryFilter
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    categories={exerciseCategories}
                                    activeCategory={activeCategory}
                                    setActiveCategory={setActiveCategory}
                                />

                                <ExerciseGrid
                                    displayedExercises={displayedExercises}
                                    searchTerm={searchTerm}
                                    activeCategory={activeCategory}
                                    trainingData={trainingData}
                                    onExerciseChange={handleExerciseChange}
                                />

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