import React from "react";
import TrainingFormHeader from "./TrainingFormHeader";
import ExerciseCategoryFilter from "./ExerciseCategoryFilter";
import ExerciseGrid from "./ExerciseGrid";
import { useTrainingForm } from "../hooks/useTrainingForm";
import { TrainingEntry } from "../services/trainingService";
import { GlassCard } from "./ui/GlassCard";
import { NeoButton } from "./ui/NeoButton";

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
                    <GlassCard className="shadow-[0_0_50px_0_rgba(8,_112,_184,_0.7)]">
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
                                    <NeoButton
                                        onClick={handleSaveTraining}
                                        disabled={isSubmitting}
                                        isLoading={isSubmitting}
                                        className="flex-1 py-6 text-xl"
                                    >
                                        Save Training
                                    </NeoButton>
                                    <NeoButton
                                        onClick={onCancel}
                                        disabled={isSubmitting}
                                        variant="secondary"
                                        className="flex-1 py-6 text-xl"
                                    >
                                        Cancel
                                    </NeoButton>
                                </div>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default TrainingSelector;