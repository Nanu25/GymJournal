import React, { useState } from "react";
import { TrainingEntry } from "../services/trainingService";
import TrainingList from "./TrainingList";
import UpdateTrainingModal from "./UpdateTrainingModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useTrainingData } from "../hooks/useTrainingData";
import { Search, X } from "lucide-react";
import { NeoButton } from "./ui/NeoButton";
import { NeoInput } from "./ui/NeoInput";
import { GlassCard } from "./ui/GlassCard";

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
        isLoading,
        error,
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

    if (isLoading) {
        return <div className="text-white text-center py-8">Loading trainings...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-8">Error loading trainings: {error}</div>;
    }

    return (
        <section id="personal-records-card" className="w-full space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-blue-400/70 mb-2 font-medium">Training history for</p>
                    <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                        {profile?.name ?? "You"}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-6">
                        {profile?.weight && (
                            <GlassCard className="!p-4 min-w-[140px] border-blue-500/10 bg-[#111c33]/50">
                                <p className="text-xs uppercase text-blue-300/70 tracking-wider font-semibold">Weight</p>
                                <p className="text-2xl font-bold text-white mt-1">{profile.weight} <span className="text-sm text-slate-400 font-normal">kg</span></p>
                            </GlassCard>
                        )}
                        {profile?.height && (
                            <GlassCard className="!p-4 min-w-[140px] border-blue-500/10 bg-[#111c33]/50">
                                <p className="text-xs uppercase text-blue-300/70 tracking-wider font-semibold">Height</p>
                                <p className="text-2xl font-bold text-white mt-1">{profile.height} <span className="text-sm text-slate-400 font-normal">cm</span></p>
                            </GlassCard>
                        )}
                        <GlassCard className="!p-4 min-w-[140px] border-blue-500/10 bg-[#111c33]/50">
                            <p className="text-xs uppercase text-blue-300/70 tracking-wider font-semibold">Sessions</p>
                            <p className="text-2xl font-bold text-white mt-1">{trainings.length}</p>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <div className="flex-grow md:max-w-md">
                    <NeoInput
                        placeholder="Search by date or exercise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search className="w-5 h-5" />}
                        onClear={() => setSearchTerm('')}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 items-center">
                    <NeoButton
                        variant={sortField === "date" ? "primary" : "secondary"}
                        onClick={() => handleSort("date")}
                        size="sm"
                    >
                        Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                    </NeoButton>
                    <NeoButton
                        variant={sortField === "pr" ? "primary" : "secondary"}
                        onClick={() => handleSort("pr")}
                        size="sm"
                    >
                        PR {sortField === "pr" && (sortDirection === "asc" ? "↑" : "↓")}
                    </NeoButton>
                    <NeoButton
                        variant={sortField === "exercises" ? "primary" : "secondary"}
                        onClick={() => handleSort("exercises")}
                        size="sm"
                    >
                        Exercises {sortField === "exercises" && (sortDirection === "asc" ? "↑" : "↓")}
                    </NeoButton>

                    {sortField && (
                        <button
                            onClick={() => handleSort(null)}
                            className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                            title="Clear sort"
                        >
                            <X size={18} />
                        </button>
                    )}
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