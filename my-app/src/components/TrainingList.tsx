import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

interface TrainingListProps {
    trainings: TrainingEntry[];
    exerciseStats: { max: number; min: number; avg: number };
    onUpdate: (index: number) => void;
    onDelete: (training: TrainingEntry) => void;
}

const TrainingList: React.FC<TrainingListProps> = ({
    trainings,
    exerciseStats,
    onUpdate,
    onDelete
}) => {
    const [expandedTraining, setExpandedTraining] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const pageCount = Math.max(1, Math.ceil(trainings.length / itemsPerPage));
    const currentTrainings = trainings.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const toggleExpandTraining = (index: number) => {
        setExpandedTraining(expandedTraining === index ? null : index);
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
    };

    if (trainings.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 bg-[#111c33] rounded-2xl border border-blue-500/10">
                <p className="text-blue-200/50 text-xl">No training sessions found</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {currentTrainings.map((training, index) => {
                // Calculate original index if needed, but for display we use current slice
                // For update/delete we need to pass the correct identifier or object
                // Here we pass the index relative to the current page for UI, but the parent might need more info
                // Actually, let's pass the training object or find the index in the full list
                // The parent (PersonalRecordsCard) handles the logic.
                // We'll pass the index relative to the *filtered* list if the parent expects that,
                // OR we can just pass the training object itself if possible.
                // The onUpdate prop in PersonalRecordsCard expects an index.
                // Let's find the index in the full `trainings` array passed to this component.
                const originalIndex = trainings.findIndex(t => t.date === training.date);

                const prExercise = Object.entries(training.exercises).reduce((max, [name, weight]) =>
                    !max || weight > max.weight ? { name, weight } : max
                    , null as { name: string; weight: number } | null);

                const exerciseCount = Object.keys(training.exercises).length;
                const prText = prExercise ? `${prExercise.name}: ${prExercise.weight} kg` : "None";

                const isHighPerformer = exerciseCount === exerciseStats.max;
                const isLowPerformer = exerciseCount === exerciseStats.min;
                const isAveragePerformer = exerciseCount === Math.round((exerciseStats.max + exerciseStats.min) / 2);

                const borderColor = isHighPerformer
                    ? "border-amber-500/30"
                    : isLowPerformer
                        ? "border-red-500/30"
                        : isAveragePerformer
                            ? "border-blue-500/30"
                            : "border-blue-500/10";

                const statHighlight = isHighPerformer
                    ? "bg-gradient-to-r from-amber-500/5 to-amber-600/5"
                    : isLowPerformer
                        ? "bg-gradient-to-r from-red-500/5 to-red-600/5"
                        : isAveragePerformer
                            ? "bg-gradient-to-r from-blue-500/5 to-blue-600/5"
                            : "bg-[#1a2234]/50";

                const performanceIndicator = isHighPerformer
                    ? "text-amber-400"
                    : isLowPerformer
                        ? "text-red-400"
                        : isAveragePerformer
                            ? "text-blue-400"
                            : "text-blue-200/50";

                return (
                    <div
                        key={`${training.date}-${index}`}
                        className={`rounded-lg overflow-hidden border ${borderColor} transition-all duration-200 hover:border-blue-500/30 ${expandedTraining === originalIndex ? "ring-1 ring-blue-500/30 bg-[#151e32]" : "bg-[#111c33]"
                            }`}
                    >
                        <div
                            className={`px-4 py-3 cursor-pointer group ${statHighlight}`}
                            onClick={() => toggleExpandTraining(originalIndex)}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-6 min-w-0 flex-grow">
                                    <span className="text-white font-semibold text-base tracking-wide whitespace-nowrap w-24">
                                        {training.date}
                                    </span>

                                    <div className="hidden sm:flex items-center gap-6 flex-grow">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 whitespace-nowrap ${performanceIndicator}`}>
                                            {exerciseCount} exercises
                                        </span>
                                        {prExercise && (
                                            <div className="flex items-center gap-2 text-sm text-blue-200/60 truncate min-w-[150px]">
                                                <span className="text-[10px] uppercase tracking-wider opacity-60">Top Lift</span>
                                                <span className="font-medium text-white/90">{prText}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-1.5 text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpdate(originalIndex);
                                            }}
                                            title="Edit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            className="p-1.5 text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(training);
                                            }}
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 2 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <span className={`text-blue-400/40 transform transition-transform duration-200 ${expandedTraining === originalIndex ? "rotate-180" : ""}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            {/* Mobile stats summary */}
                            <div className="sm:hidden flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-xs">
                                <div className="flex items-center gap-3">
                                    <span className={`${performanceIndicator}`}>{exerciseCount} ex</span>
                                    {prExercise && <span className="text-white/70">{prText}</span>}
                                </div>
                            </div>
                        </div>

                        {expandedTraining === originalIndex && (
                            <div className="px-5 pb-5 pt-4 bg-[#0f1623]/50 border-t border-black/20">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(training.exercises).map(([exercise, weight], idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between items-center p-3 bg-white/[0.03] rounded-xl border border-white/5 hover:border-blue-500/20 hover:bg-white/[0.05] transition-all group"
                                        >
                                            <span className="text-blue-100/90 text-base font-medium truncate pr-4">{exercise}</span>
                                            <span className="text-white font-bold text-base bg-black/20 px-2.5 py-1 rounded-lg border border-white/5">
                                                {weight} kg
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="pt-6 border-t border-blue-500/10 space-y-6">
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                    <div className="flex items-center">
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mr-2"></div>
                        <span className="text-emerald-200">Most exercises ({exerciseStats.max})</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-2"></div>
                        <span className="text-blue-200">Average ({exerciseStats.avg})</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-2.5 h-2.5 bg-gradient-to-r from-red-400 to-red-600 rounded-full mr-2"></div>
                        <span className="text-red-200">Least exercises ({exerciseStats.min})</span>
                    </div>
                </div>

                <ReactPaginate
                    previousLabel={"←"}
                    nextLabel={"→"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination flex items-center justify-center space-x-2 mt-4"}
                    pageClassName={"px-4 py-2 bg-[#1a2234] rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-200"}
                    previousClassName={"px-4 py-2 bg-[#1a2234] rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-200"}
                    nextClassName={"px-4 py-2 bg-[#1a2234] rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-200"}
                    breakClassName={"px-4 py-2"}
                    activeClassName={"!bg-gradient-to-r from-blue-500 to-blue-600 !text-white border-blue-400 shadow-lg shadow-blue-500/20"}
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                    pageLinkClassName={"text-white"}
                    previousLinkClassName={"text-white"}
                    nextLinkClassName={"text-white"}
                    breakLinkClassName={"text-white"}
                    activeLinkClassName={"!text-white"}
                />
            </div>
        </div>
    );
};

export default TrainingList;
