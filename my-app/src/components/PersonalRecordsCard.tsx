import React, { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';

interface PaginationProps {
    pageCount: number;
    onPageChange: (selectedPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => (
    <ReactPaginate
        previousLabel={"←"}
        nextLabel={"→"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={(data) => onPageChange(data.selected)}
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
);

interface ExerciseData {
    [key: string]: number;
}

interface TrainingEntry {
    date: string;
    exercises: ExerciseData;
}

interface UpdateFormData {
    date: string;
    exercises: { name: string; weight: number }[];
}

type SortField = "date" | "pr" | "exercises" | null;
type SortDirection = "asc" | "desc";

interface PersonalRecordsCardProps {
    trainings: TrainingEntry[];
    setTrainings: React.Dispatch<React.SetStateAction<TrainingEntry[]>>;
    onUpdateTraining?: (training: TrainingEntry, index: number) => void;
    onTrainingChange?: (trainings: TrainingEntry[]) => void;
    profile?: {
        name?: string;
        weight?: number;
        height?: number;
    };
    hasCachedInitialTrainings?: boolean;
    onRequestFullRefresh?: () => Promise<void> | void;
}

const PersonalRecordsCard: React.FC<PersonalRecordsCardProps> = ({
    trainings,
    setTrainings,
    onUpdateTraining,
    onTrainingChange,
    profile,
    onRequestFullRefresh,
}) => {
    const [expandedTraining, setExpandedTraining] = useState<number | null>(null);
    const [updateFormOpen, setUpdateFormOpen] = useState<number | null>(null);
    const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
        date: "",
        exercises: [],
    });
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [trainingToDelete, setTrainingToDelete] = useState<TrainingEntry | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [exerciseStats, setExerciseStats] = useState({ max: 0, min: 0, avg: 0 });
    const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Client-side filtering and sorting
    const filteredAndSortedTrainings = React.useMemo(() => {
        let result = [...trainings];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(training =>
                training.date.includes(term) ||
                Object.keys(training.exercises).some(exercise => exercise.toLowerCase().includes(term))
            );
        }

        // Apply sorting
        if (sortField === "date") {
            result.sort((a, b) => {
                const comparison = a.date.localeCompare(b.date);
                return sortDirection === "asc" ? comparison : -comparison;
            });
        } else if (sortField === "pr") {
            result.sort((a, b) => {
                const prA = Object.values(a.exercises).length > 0 ? Math.max(...Object.values(a.exercises).map(Number)) : 0;
                const prB = Object.values(b.exercises).length > 0 ? Math.max(...Object.values(b.exercises).map(Number)) : 0;
                return sortDirection === "asc" ? prA - prB : prB - prA;
            });
        } else if (sortField === "exercises") {
            result.sort((a, b) => {
                const countA = Object.keys(a.exercises).length;
                const countB = Object.keys(b.exercises).length;
                return sortDirection === "asc" ? countA - countB : countB - countA;
            });
        }

        return result;
    }, [trainings, searchTerm, sortField, sortDirection]);

    const pageCount = Math.max(1, Math.ceil(filteredAndSortedTrainings.length / itemsPerPage));
    const currentTrainings = filteredAndSortedTrainings.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Fetch exercise options from backend on mount
    useEffect(() => {
        fetch("/api/exercises")
            .then(res => res.json())
            .then(data => {
                // Flatten all exercises into a single array
                const allExercises = Array.isArray(data)
                    ? data.flatMap((cat: { exercises: string[] }) => cat.exercises)
                    : data.data && Array.isArray(data.data)
                        ? data.data.flatMap((cat: { exercises: string[] }) => cat.exercises)
                        : [];
                setExerciseOptions(allExercises);
            })
            .catch(err => console.error("Failed to fetch exercises for update form:", err));
    }, []);

    // Function to handle initial delete button click
    const handleDelete = (training: TrainingEntry) => {
        setTrainingToDelete(training);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!trainingToDelete || isDeleting) {
            return;
        }

        setIsDeleting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const encodedDate = encodeURIComponent(trainingToDelete.date);
            const response = await fetch(`/api/trainings/${encodedDate}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // If the resource is not found (404), consider it already deleted
            if (!response.ok && response.status !== 404) {
                const errorData = await response.json().catch(() => ({})); // Handle non-JSON error responses safely
                throw new Error(errorData.message || 'Failed to delete training');
            }

            // Update local state
            setTrainings(prev => {
                const updated = prev.filter(t => t.date !== trainingToDelete.date);
                if (onTrainingChange) {
                    onTrainingChange(updated);
                }
                return updated;
            });

            // Optionally refresh from server
            if (onRequestFullRefresh) {
                try {
                    await onRequestFullRefresh();
                } catch (refreshError) {
                    console.warn('Training deleted locally, but failed to refresh list from server:', refreshError);
                }
            }

            setTrainingToDelete(null);
            setShowDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting training:', error);
            alert(`Failed to delete training: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // Function to cancel deletion
    const cancelDelete = () => {
        setTrainingToDelete(null);
        setShowDeleteDialog(false);
    };

    const toggleExpandTraining = (index: number) => {
        setExpandedTraining(expandedTraining === index ? null : index);
    };

    const handleUpdate = (index: number) => {
        if (onUpdateTraining) {
            onUpdateTraining(trainings[index], index);
        } else {
            const training = trainings[index];

            // Fetch the latest exercises from the API before opening the update form
            fetch("/api/exercises")
                .then(res => res.json())
                .then(data => {
                    // Flatten all exercises into a single array
                    const allExercises = Array.isArray(data)
                        ? data.flatMap((cat: { exercises: string[] }) => cat.exercises)
                        : data.data
                            ? data.data.flatMap((cat: { exercises: string[] }) => cat.exercises)
                            : [];

                    setExerciseOptions(allExercises);

                    // Now set up the update form with the training data
                    const exercises = Object.entries(training.exercises).map(([name, weight]) => ({
                        name,
                        weight,
                    }));

                    setUpdateFormData({
                        date: training.date,
                        exercises,
                    });

                    setUpdateFormOpen(index);
                })
                .catch(err => {
                    console.error("Failed to fetch exercises for update form:", err);
                    // Still open the update form even if fetch fails
                    const exercises = Object.entries(training.exercises).map(([name, weight]) => ({
                        name,
                        weight,
                    }));

                    setUpdateFormData({
                        date: training.date,
                        exercises,
                    });

                    setUpdateFormOpen(index);
                });
        }
    };

    const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setUpdateFormData({
            ...updateFormData,
            [field]: e.target.value,
        });
    };

    const handleExerciseNameChange = (index: number, value: string) => {
        const updatedExercises = [...updateFormData.exercises];
        updatedExercises[index] = { ...updatedExercises[index], name: value };
        setUpdateFormData({
            ...updateFormData,
            exercises: updatedExercises,
        });
    };

    const handleExerciseWeightChange = (index: number, value: string) => {
        const updatedExercises = [...updateFormData.exercises];
        updatedExercises[index] = { ...updatedExercises[index], weight: parseFloat(value) || 0 };
        setUpdateFormData({
            ...updateFormData,
            exercises: updatedExercises,
        });
    };

    const addExerciseField = () => {
        setUpdateFormData({
            ...updateFormData,
            exercises: [...updateFormData.exercises, { name: "", weight: 0 }],
        });
    };

    const removeExerciseField = (index: number) => {
        const updatedExercises = [...updateFormData.exercises];
        updatedExercises.splice(index, 1);
        setUpdateFormData({
            ...updateFormData,
            exercises: updatedExercises,
        });
    };

    const submitUpdateForm = async () => {
        if (updateFormOpen !== null && !isUpdating) {
            const exercisesObject: { [key: string]: number } = {};
            updateFormData.exercises.forEach((exercise) => {
                if (exercise.name.trim()) {
                    exercisesObject[exercise.name.trim()] = exercise.weight;
                }
            });

            setIsUpdating(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }

                // Use the date string directly as it should be in YYYY-MM-DD format from the date input
                const formattedDate = updateFormData.date;

                const response = await fetch(`/api/trainings/${formattedDate}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        date: formattedDate,
                        exercises: exercisesObject,
                    }),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message || 'Failed to update training');
                }

                // Update local state immediately
                setTrainings(prev => {
                    const updated = prev.map((t, i) => {
                        if (i === updateFormOpen) {
                            return {
                                ...t,
                                date: formattedDate,
                                exercises: exercisesObject
                            };
                        }
                        return t;
                    });

                    if (onTrainingChange) {
                        onTrainingChange(updated);
                    }
                    return updated;
                });

                // Optionally refresh from server to ensure consistency
                if (onRequestFullRefresh) {
                    await onRequestFullRefresh();
                }

                setUpdateFormOpen(null);
            } catch (error) {
                console.error('Error in update process:', error);
                alert(`Failed to update training: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const cancelUpdateForm = () => {
        setUpdateFormOpen(null);
    };

    const handleSort = (field: "date" | "pr" | "exercises") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handlePageChange = (selectedPage: number) => {
        setCurrentPage(selectedPage);
    };

    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm, sortField, sortDirection]);

    // Calculate exercise statistics
    useEffect(() => {
        if (filteredAndSortedTrainings.length > 0) {
            const exerciseCounts = filteredAndSortedTrainings.map(t => Object.keys(t.exercises).length);
            const stats = {
                min: Math.min(...exerciseCounts),
                max: Math.max(...exerciseCounts),
                avg: Math.round(exerciseCounts.reduce((a, b) => a + b, 0) / exerciseCounts.length)
            };
            setExerciseStats(stats);
        } else {
            setExerciseStats({ max: 0, min: 0, avg: 0 });
        }
    }, [filteredAndSortedTrainings]);



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
            <div className="space-y-4">
                {currentTrainings.length === 0 ? (
                    <div className="flex items-center justify-center h-48 bg-[#111c33] rounded-2xl border border-blue-500/10">
                        <p className="text-blue-200/50 text-xl">No training sessions found</p>
                    </div>
                ) : (
                    currentTrainings.map((training, index) => {
                        const originalIndex = filteredAndSortedTrainings.findIndex(t => t.date === training.date);
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
                            ? "bg-gradient-to-r from-amber-500/10 to-amber-600/10"
                            : isLowPerformer
                                ? "bg-gradient-to-r from-red-500/10 to-red-600/10"
                                : isAveragePerformer
                                    ? "bg-gradient-to-r from-blue-500/10 to-blue-600/10"
                                    : "bg-[#1a2234]";

                        const performanceIndicator = isHighPerformer
                            ? "text-amber-400"
                            : isLowPerformer
                                ? "text-red-400"
                                : isAveragePerformer
                                    ? "text-blue-400"
                                    : "text-blue-200/70";

                        return (
                            <div
                                key={`${training.date}-${index}`}
                                className={`rounded-2xl overflow-hidden border ${borderColor} transition-all duration-200 ${expandedTraining === originalIndex ? "ring-2 ring-blue-500/50" : ""
                                    }`}
                            >
                                <div className={`p-5 ${statHighlight}`}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div
                                            className="flex items-center cursor-pointer flex-grow w-full"
                                            onClick={() => toggleExpandTraining(originalIndex)}
                                        >
                                            <div className="flex flex-col mr-6">
                                                <span className="text-white font-bold text-xl">
                                                    {training.date}
                                                </span>
                                                <span className={`${performanceIndicator} text-lg mt-1`}>
                                                    {exerciseCount} exercises
                                                </span>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="text-white font-medium text-xl">PR: {prText}</div>
                                            </div>
                                            <span className="text-blue-200/70 ml-6 mr-4 text-2xl transition-transform duration-200">
                                                {expandedTraining === originalIndex ? "▲" : "▼"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                                            <button
                                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg border border-emerald-400/20 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdate(originalIndex);
                                                }}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Update
                                            </button>
                                            <button
                                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg border border-rose-400/20 hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-md shadow-rose-500/20 hover:shadow-rose-500/30 flex items-center justify-center gap-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(training);
                                                }}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {expandedTraining === originalIndex && (
                                    <div className="p-5 bg-[#111c33]/50 border-t border-blue-500/10">
                                        <h4 className="text-white font-semibold text-lg mb-4">Exercises:</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {Object.entries(training.exercises).map(([exercise, weight], idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-[#111c33] p-4 rounded-xl flex justify-between items-center border border-blue-500/10 hover:border-blue-400/30 transition-all duration-200"
                                                >
                                                    <span className="text-white text-base truncate mr-3">{exercise}</span>
                                                    <span className="text-white font-bold text-base whitespace-nowrap px-4 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                                        {weight} kg
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer Actions */}
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

                <Pagination pageCount={pageCount} onPageChange={handlePageChange} />


            </div>

            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1a2234] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/10">
                        <h3 className="text-2xl font-bold mb-4 text-white">Confirm Delete</h3>
                        <p className="mb-6 text-blue-200/70">Are you sure you want to delete this training session?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-6 py-2 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={cancelDelete}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl border border-rose-500/20 hover:from-rose-600 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {updateFormOpen !== null && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1a2234] p-8 rounded-2xl shadow-2xl max-w-lg w-full max-h-screen overflow-y-auto border border-white/10">
                        <h3 className="text-2xl font-bold mb-6 text-white">Update Training Session</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-blue-200">Date:</label>
                            <input
                                type="date"
                                value={updateFormData.date}
                                onChange={(e) => handleUpdateInputChange(e, "date")}
                                className="w-full px-4 py-2 bg-[#0f172a] border border-blue-500/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-blue-200">Exercises:</label>
                            {updateFormData.exercises.map((exercise, idx) => (
                                <div key={idx} className="flex mb-3 space-x-2">
                                    <select
                                        value={exercise.name}
                                        onChange={(e) => handleExerciseNameChange(idx, e.target.value)}
                                        className="flex-grow px-4 py-2 bg-[#0f172a] border border-blue-500/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                                    >
                                        <option value="" disabled>Select exercise</option>
                                        {exerciseOptions.length > 0 ? (
                                            exerciseOptions.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))
                                        ) : (
                                            // If no exercise options are loaded, show current exercise
                                            <option key={exercise.name} value={exercise.name}>{exercise.name}</option>
                                        )}
                                    </select>
                                    <input
                                        type="number" min="0"
                                        placeholder="Weight (kg)"
                                        value={exercise.weight}
                                        onChange={(e) => handleExerciseWeightChange(idx, e.target.value)}
                                        className="w-24 px-4 py-2 bg-[#0f172a] border border-blue-500/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExerciseField(idx)}
                                        className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-all duration-200"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addExerciseField}
                                className="mt-3 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all duration-200 w-full"
                            >
                                + Add Exercise
                            </button>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                className="px-6 py-2 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={cancelUpdateForm}
                                disabled={isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl border border-emerald-500/20 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={submitUpdateForm}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </section>
    );
};

export default PersonalRecordsCard;