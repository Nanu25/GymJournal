import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import Masonry from 'react-masonry-css';
import TrainingCard from './TrainingCard';
import TrainingLegend from './TrainingLegend';

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
    const itemsPerPage = 12;

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

    const breakpointColumnsObj = {
        default: 3,
        1024: 2,
        768: 1
    };

    return (
        <div className="space-y-6">
            {/* Masonry Grid Layout */}
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto -ml-6"
                columnClassName="pl-6 bg-clip-padding"
            >
                {currentTrainings.map((training, index) => {
                    const originalIndex = trainings.findIndex(t => t.date === training.date);

                    return (
                        <TrainingCard
                            key={`${training.date}-${index}`}
                            training={training}
                            exerciseStats={exerciseStats}
                            isExpanded={expandedTraining === originalIndex}
                            onToggleExpand={() => toggleExpandTraining(originalIndex)}
                            onEdit={() => onUpdate(originalIndex)}
                            onDelete={() => onDelete(training)}
                        />
                    );
                })}
            </Masonry>

            <div className="pt-6 border-t border-blue-500/10 space-y-6">
                <TrainingLegend />

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
