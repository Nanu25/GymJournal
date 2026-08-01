import React from 'react';

interface DisplayedExercise {
    name: string;
    category: string;
}

interface ExerciseGridProps {
    displayedExercises: DisplayedExercise[];
    searchTerm: string;
    activeCategory: string;
    trainingData: { [key: string]: number };
    onExerciseChange: (exercise: string, value: number) => void;
}

const ExerciseGrid: React.FC<ExerciseGridProps> = ({
    displayedExercises,
    searchTerm,
    activeCategory,
    trainingData,
    onExerciseChange
}) => {
    return (
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
                                onChange={(e) => onExerciseChange(exercise.name, Math.round(Number(e.target.value)))}
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
    );
};

export default ExerciseGrid;
