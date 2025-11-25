import React, { useState } from "react";
import { TrainingEntry } from "../services/trainingService";
import TrainingList from "./TrainingList";
import UpdateTrainingModal from "./UpdateTrainingModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useTrainingData } from "../hooks/useTrainingData";

interface PersonalRecordsCardProps {
    profile?: {
        name?: string;
        weight?: number;
        height?: number;
    };
}

const PersonalRecordsCard: React.FC<PersonalRecordsCardProps> = ({ profile }) => {
    const {
        trainings,
        searchTerm,
        setSearchTerm,
        sortField,
        sortDirection,
        handleSort,
        exerciseStats,
        deleteTraining,
        updateTraining
    } = useTrainingData();

    const [trainingToDelete, setTrainingToDelete] = useState<TrainingEntry | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [updateFormOpen, setUpdateFormOpen] = useState<number | null>(null);
    const [trainingToUpdate, setTrainingToUpdate] = useState<TrainingEntry | null>(null);

    const handleDeleteClick = (training: TrainingEntry) => {
        setTrainingToDelete(training);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!trainingToDelete || isDeleting) return;

        setIsDeleting(true);
        try {
            await deleteTraining(trainingToDelete.date);
            setTrainingToDelete(null);
            setShowDeleteDialog(false);
        } catch (error) {
            // Error is handled by the hook (toast)
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setTrainingToDelete(null);
        setShowDeleteDialog(false);
    };

    const handleUpdateClick = (index: number) => {
        const training = trainings[index];
        setTrainingToUpdate(training);
        setUpdateFormOpen(index);
    };

    const handleUpdateSubmit = async (date: string, exercises: { [key: string]: number }) => {
        try {
            await updateTraining(date, exercises);
            setUpdateFormOpen(null);
            setTrainingToUpdate(null);
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <section id="personal-records-card" className="w-full space-y-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-blue-400/70 mb-2">Training history for</p>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                        {profile?.name ?? "You"}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {profile?.weight && (
                            <div className="px-4 py-2 rounded-xl border border-blue-500/10 bg-[#111c33]">
                                <p className="text-xs uppercase text-blue-300/70 tracking-wider">Weight</p>
                                <p className="text-xl font-semibold text-white mt-1">{profile.weight} kg</p>
                            </div>
                        )}
                        {profile?.height && (
                            <div className="px-4 py-2 rounded-xl border border-blue-500/10 bg-[#111c33]">
                                <p className="text-xs uppercase text-blue-300/70 tracking-wider">Height</p>
                                <p className="text-xl font-semibold text-white mt-1">{profile.height} cm</p>
                            </div>
                        )}
                        <div className="px-4 py-2 rounded-xl border border-blue-500/10 bg-[#111c33]">
                            <p className="text-xs uppercase text-blue-300/70 tracking-wider">Sessions</p>
                            <p className="text-xl font-semibold text-white mt-1">{trainings.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex-grow min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search by date or exercise"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-3 border border-blue-500/10 rounded-xl bg-[#111c33] text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSort("date")}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${sortField === "date"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20"
                            : "bg-[#111c33] text-white border-blue-500/10 hover:border-blue-500/30"
                            }`}
                    >
                        Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                        onClick={() => handleSort("pr")}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${sortField === "pr"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20"
                            : "bg-[#111c33] text-white border-blue-500/10 hover:border-blue-500/30"
                            }`}
                    >
                        PR {sortField === "pr" && (sortDirection === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                        onClick={() => handleSort("exercises")}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${sortField === "exercises"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20"
                            : "bg-[#111c33] text-white border-blue-500/10 hover:border-blue-500/30"
                            }`}
                    >
                        #Exercises {sortField === "exercises" && (sortDirection === "asc" ? "↑" : "↓")}
                    </button>
                </div>
            </div>

            {/* Training List */}
            <TrainingList
                trainings={trainings}
                exerciseStats={exerciseStats}
                onUpdate={handleUpdateClick}
                onDelete={handleDeleteClick}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteDialog}
                isDeleting={isDeleting}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />

            <UpdateTrainingModal
                isOpen={updateFormOpen !== null}
                initialData={trainingToUpdate}
                onClose={() => {
                    setUpdateFormOpen(null);
                    setTrainingToUpdate(null);
                }}
                onUpdate={handleUpdateSubmit}
            />
        </section>
    );
};

export default PersonalRecordsCard;