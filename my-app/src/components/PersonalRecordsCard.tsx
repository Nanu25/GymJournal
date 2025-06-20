"use client";

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
        pageClassName={"px-4 py-2 bg-[#1a2234] text-blue-200 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-200"}
        previousClassName={"px-4 py-2 bg-[#1a2234] text-blue-200 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-200"}
        nextClassName={"px-4 py-2 bg-[#1a2234] text-blue-200 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-200"}
        breakClassName={"px-4 py-2 text-blue-200"}
        activeClassName={"!bg-gradient-to-r from-blue-500 to-blue-600 !text-white border-blue-400 shadow-lg shadow-blue-500/20"}
        disabledClassName={"opacity-50 cursor-not-allowed"}
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
    onNavigateToMetricsSection: () => void;
    onNavigateToTrainingSelector: () => void;
    onUpdateTraining?: (training: TrainingEntry, index: number) => void;
    onTrainingChange?: (trainings: TrainingEntry[]) => void;
    weight?: number;
}

const PersonalRecordsCard: React.FC<PersonalRecordsCardProps> = ({
    trainings,
    setTrainings,
    onNavigateToMetricsSection,
    onNavigateToTrainingSelector,
    onUpdateTraining,
    onTrainingChange,
    weight: propWeight,
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
    const itemsPerPage = 5;
    const [weight, setWeight] = useState<number | null>(propWeight || null);
    const [trainingToDelete, setTrainingToDelete] = useState<TrainingEntry | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [exerciseStats, setExerciseStats] = useState({ max: 0, min: 0, avg: 0 });
    const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
    const [pageCount, setPageCount] = useState(0);

    // Fetch weight from the backend when the component mounts
    useEffect(() => {
        // Use prop weight if available, otherwise set a default (0)
        if (propWeight !== undefined) {
            setWeight(propWeight);
        } else {
            setWeight(0); // Set a default immediately so we don't show "Loading..."
        }
        
        const fetchWeight = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }
                const response = await fetch("/api/user", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch weight");
                }
                const data = await response.json();
                console.log('Received user data in PersonalRecordsCard:', data);
                setWeight(data.weight || 0);
            } catch (error) {
                console.error("Error fetching weight:", error);
                // Keep the default weight if fetch fails
            }
        };
        fetchWeight();
    }, [propWeight]);

    // Fetch exercise options from backend on mount
    useEffect(() => {
        fetch("/api/exercises")
            .then(res => res.json())
            .then(data => {
                // Flatten all exercises into a single array
                const allExercises = data.flatMap((cat: { exercises: string[] }) => cat.exercises);
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
        if (!trainingToDelete) {
            console.error('Invalid trainingToDelete:', trainingToDelete);
            return;
        }

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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete training');
            }

            // Fetch updated trainings after delete
            const updatedResponse = await fetch('/api/trainings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!updatedResponse.ok) {
                const errorData = await updatedResponse.json();
                console.error('Failed to fetch updated trainings:', errorData);
                throw new Error('Failed to fetch updated trainings');
            }

            const updatedData = await updatedResponse.json();
            // Extract trainings from the paginated response
            if (updatedData.data && Array.isArray(updatedData.data)) {
                setTrainings(updatedData.data);
                if (onTrainingChange) {
                    onTrainingChange(updatedData.data);
                }
                console.log("Updated trainings after delete:", updatedData.data);
            } else {
                // Fallback for backward compatibility
                const trainingsArray = Array.isArray(updatedData) ? updatedData : [];
                setTrainings(trainingsArray);
                if (onTrainingChange) {
                    onTrainingChange(trainingsArray);
                }
                console.log("Updated trainings after delete (old format):", trainingsArray);
            }

            setTrainingToDelete(null);
            setShowDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting training:', error);
            alert(`Failed to delete training: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                    console.log("Fetched exercise options for update:", allExercises);
                    
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
        if (updateFormOpen !== null) {
            const exercisesObject: { [key: string]: number } = {};
            updateFormData.exercises.forEach((exercise) => {
                if (exercise.name.trim()) {
                    exercisesObject[exercise.name.trim()] = exercise.weight;
                }
            });

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }

                // Ensure the date is in YYYY-MM-DD format
                const formattedDate = new Date(updateFormData.date).toISOString().split('T')[0];
                console.log('Making update request with data:', {
                    date: formattedDate,
                    exercises: exercisesObject
                });

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
                    console.error('Update request failed:', responseData);
                    throw new Error(responseData.message || 'Failed to update training');
                }

                // Fetch the updated list of trainings
                const updatedResponse = await fetch('/api/trainings', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!updatedResponse.ok) {
                    const errorData = await updatedResponse.json();
                    console.error('Failed to fetch updated trainings:', errorData);
                    throw new Error('Failed to fetch updated trainings');
                }

                const updatedData = await updatedResponse.json();
                // Extract trainings from the paginated response
                if (updatedData.data && Array.isArray(updatedData.data)) {
                    setTrainings(updatedData.data);
                    if (onTrainingChange) {
                        onTrainingChange(updatedData.data);
                    }
                    console.log("Updated trainings:", updatedData.data);
                } else {
                    // Fallback for backward compatibility
                    const trainingsArray = Array.isArray(updatedData) ? updatedData : [];
                    setTrainings(trainingsArray);
                    if (onTrainingChange) {
                        onTrainingChange(trainingsArray);
                    }
                    console.log("Updated trainings (old format):", trainingsArray);
                }

                setUpdateFormOpen(null);
            } catch (error) {
                console.error('Error in update process:', error);
                alert(`Failed to update training: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        const fetchTrainings = async () => {
            // Build query parameters - only include parameters with values
            const params: Record<string, string> = {};
            if (searchTerm) params.searchTerm = searchTerm;
            if (sortField) params.sortField = sortField;
            if (sortDirection) params.sortDirection = sortDirection;
            params.page = (currentPage + 1).toString(); // backend is 1-based
            params.limit = itemsPerPage.toString();

            const query = new URLSearchParams(params).toString();
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Not authenticated');
                return;
            }

            try {
                console.log(`Fetching trainings with query: ${query}`);
                const response = await fetch(`/api/trainings?${query}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Received trainings data:", data);
                
                if (data.data && Array.isArray(data.data)) {
                    setTrainings(data.data);
                    setPageCount(data.pageCount || 1);
                    console.log("Trainings set from paginated data:", data.data);
                } else if (Array.isArray(data)) {
                    setTrainings(data);
                    setPageCount(Math.ceil(data.length / itemsPerPage) || 1);
                    console.log("Trainings set from array data:", data);
                } else {
                    console.error("Unexpected data format:", data);
                    setTrainings([]);
                    setPageCount(1);
                }
            } catch (error) {
                console.error('Error fetching trainings:', error);
                setTrainings([]);
                setPageCount(1);
            }
        };
        fetchTrainings();
    // eslint-disable-next-line
    }, [searchTerm, sortField, sortDirection, currentPage]);

    const currentTrainings = Array.isArray(trainings)
        ? trainings.map((training, originalIndex) => ({ training, originalIndex }))
        : [];

    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm, sortField, sortDirection]);

    // Calculate exercise statistics
    useEffect(() => {
        if (trainings.length > 0) {
            const exerciseCounts = trainings.map(t => Object.keys(t.exercises).length);
            const stats = {
                min: Math.min(...exerciseCounts),
                max: Math.max(...exerciseCounts),
                avg: Math.round(exerciseCounts.reduce((a, b) => a + b, 0) / exerciseCounts.length)
            };
            setExerciseStats(stats);
        } else {
            setExerciseStats({ max: 0, min: 0, avg: 0 });
        }
    }, [trainings]);

  

    return (
        <section
            id="personal-records-card"
            className="relative p-10 bg-[#0f172a] min-h-[800px] rounded-[32px] w-full flex flex-col shadow-[0_0_50px_0_rgba(8,_112,_184,_0.7)] border border-blue-500/10 backdrop-blur-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 to-transparent rounded-[32px] pointer-events-none" />
            
            <h2 className="relative text-5xl font-bold text-center bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-12 tracking-wide">
                Training History
            </h2>

            <div className="relative flex items-center bg-[#1a2234] p-8 rounded-2xl border border-blue-500/10">
                <div className="flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-4"></div>
                    <div className="text-3xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent font-medium">
                        Current Weight
                    </div>
                </div>
                <div className="ml-auto text-3xl font-bold text-white bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-8 py-3 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10">
                    {weight !== null ? `${weight} kg` : "Loading..."}
                </div>
            </div>

            <div className="relative mt-8 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-grow max-w-md">
                        <input
                            type="text"
                            placeholder="Search by date or exercise"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 text-lg border border-blue-500/10 rounded-xl bg-[#1a2234] text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleSort("date")}
                            className={`px-6 py-4 rounded-xl text-lg transition-all duration-200 ${
                                sortField === "date" 
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20" 
                                    : "bg-[#1a2234] text-black-200 border border-blue-500/10 hover:border-blue-500/30"
                            }`}
                        >
                            Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                        </button>
                        <button
                            onClick={() => handleSort("pr")}
                            className={`px-6 py-4 rounded-xl text-lg transition-all duration-200 ${
                                sortField === "pr" 
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20" 
                                    : "bg-[#1a2234] text-black-200 border border-blue-500/10 hover:border-blue-500/30"
                            }`}
                        >
                            PR {sortField === "pr" && (sortDirection === "asc" ? "↑" : "↓")}
                        </button>
                        <button
                            onClick={() => handleSort("exercises")}
                            className={`px-6 py-4 rounded-xl text-lg transition-all duration-200 ${
                                sortField === "exercises" 
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20" 
                                    : "bg-[#1a2234] text-black-200 border border-blue-500/10 hover:border-blue-500/30"
                            }`}
                        >
                            #Exercises {sortField === "exercises" && (sortDirection === "asc" ? "↑" : "↓")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative space-y-6">
                {currentTrainings.length === 0 ? (
                    <div className="flex items-center justify-center h-48 bg-[#1a2234] rounded-2xl border border-blue-500/10">
                        <p className="text-blue-200/50 text-xl">No training sessions found</p>
                    </div>
                ) : (
                    currentTrainings.map(({ training, originalIndex }) => {
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
                                key={originalIndex}
                                className={`rounded-2xl overflow-hidden border ${borderColor} transition-all duration-200 ${
                                    expandedTraining === originalIndex ? "ring-2 ring-blue-500/50" : ""
                                }`}
                            >
                                <div className={`p-6 ${statHighlight}`}>
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
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                                            <button
                                                className="w-full sm:w-auto px-4 py-2 text-base font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-400 transition-all duration-200 shadow hover:border-blue-300"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdate(originalIndex);
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="w-full sm:w-auto px-4 py-2 text-base font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl border border-red-400 transition-all duration-200 shadow hover:border-red-300"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(training);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {expandedTraining === originalIndex && (
                                    <div className="p-6 bg-[#1a2234]/50 border-t border-blue-500/10">
                                        <h4 className="text-white font-semibold text-xl mb-6">Exercises:</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {Object.entries(training.exercises).map(([exercise, weight], idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-[#1a2234] p-5 rounded-xl flex justify-between items-center border border-blue-500/10 hover:border-blue-400/30 transition-all duration-200"
                                                >
                                                    <span className="text-white text-lg truncate mr-3">{exercise}</span>
                                                    <span className="text-white font-bold text-lg whitespace-nowrap px-5 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
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

            <div className="relative mt-8 pt-6 border-t border-blue-500/10">
                <div className="flex justify-center space-x-8 text-sm mb-6">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mr-2"></div>
                        <span className="text-emerald-200">Most exercises ({exerciseStats.max})</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-2"></div>
                        <span className="text-blue-200">Average ({exerciseStats.avg})</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full mr-2"></div>
                        <span className="text-red-200">Least exercises ({exerciseStats.min})</span>
                    </div>
                </div>

                <Pagination pageCount={pageCount} onPageChange={handlePageChange} />

                <div className="mt-8 space-y-4">
                    <button
                        className="w-full py-4 text-xl font-bold text-center text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-400 hover:border-blue-300 transition-all duration-200 shadow-lg shadow-blue-500/20"
                        onClick={onNavigateToTrainingSelector}
                    >
                        Add Training Session
                    </button>
                    <button
                        className="w-full py-4 text-xl font-bold text-center text-black bg-white/80 md:text-black md:bg-[#1a2234] rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-200"
                        onClick={onNavigateToMetricsSection}
                    >
                        Edit Metrics
                    </button>
                </div>
            </div>

            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-stone-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-stone-700/30">
                        <h3 className="text-2xl font-bold mb-4 text-white">Confirm Delete</h3>
                        <p className="mb-6 text-stone-300">Are you sure you want to delete this training session?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-6 py-2 bg-stone-700/50 text-black rounded-lg hover:bg-stone-700/70 transition-all duration-200"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-red-500/80 text-black rounded-lg hover:bg-red-500 transition-all duration-200"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {updateFormOpen !== null && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-stone-800 p-8 rounded-xl shadow-2xl max-w-lg w-full max-h-screen overflow-y-auto border border-stone-700/30">
                        <h3 className="text-2xl font-bold mb-6 text-white">Update Training Session</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-stone-300">Date:</label>
                            <input
                                type="text"
                                value={updateFormData.date}
                                onChange={(e) => handleUpdateInputChange(e, "date")}
                                className="w-full px-4 py-2 bg-stone-700/50 border border-stone-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-stone-500/50"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-stone-300">Exercises:</label>
                            {updateFormData.exercises.map((exercise, idx) => (
                                <div key={idx} className="flex mb-3 space-x-2">
                                    <select
                                        value={exercise.name}
                                        onChange={(e) => handleExerciseNameChange(idx, e.target.value)}
                                        className="flex-grow px-4 py-2 bg-stone-700/50 border border-stone-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-stone-500/50"
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
                                        className="w-24 px-4 py-2 bg-stone-700/50 border border-stone-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-stone-500/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExerciseField(idx)}
                                        className="px-4 py-2 bg-red-500/80 text-black rounded-lg hover:bg-red-500 transition-all duration-200"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addExerciseField}
                                className="mt-3 px-4 py-2 bg-blue-500/80 text-black rounded-lg hover:bg-blue-500 transition-all duration-200"
                            >
                                Add Exercise
                            </button>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                className="px-6 py-2 bg-stone-700/50 text-black rounded-lg hover:bg-stone-700/70 transition-all duration-200"
                                onClick={cancelUpdateForm}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 bg-green-500/80 text-black rounded-lg hover:bg-green-500 transition-all duration-200"
                                onClick={submitUpdateForm}
                            >
                                Save Changes
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