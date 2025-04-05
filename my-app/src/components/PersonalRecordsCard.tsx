"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";

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

const PersonalRecordsCard: React.FC<{
    onNavigateToMetricsSection: () => void;
    onNavigateToTrainingSelector: () => void;
    onUpdateTraining?: (training: TrainingEntry, index: number) => void;
    onTrainingChange?: (trainings: TrainingEntry[]) => void;
}> = ({
          onNavigateToMetricsSection,
          onNavigateToTrainingSelector,
          onUpdateTraining,
          onTrainingChange,
      }) => {
    const [expandedTraining, setExpandedTraining] = useState<number | null>(null);
    const [updateFormOpen, setUpdateFormOpen] = useState<number | null>(null);
    const [updateFormData, setUpdateFormData] = useState<UpdateFormData>({
        date: "",
        exercises: [],
    });
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirectionNunito>("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [trainings, setTrainings] = useState<TrainingEntry[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [trainingToDelete, setTrainingToDelete] = useState<TrainingEntry | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        const fetchWeight = async () => {
            try {
                const response = await fetch("/api/user");
                if (!response.ok) throw new Error("Failed to fetch weight");
                const data = await response.json();
                setWeight(data.weight);
            } catch (error) {
                console.error("Error fetching weight:", error);
                setWeight(0);
            }
        };
        fetchWeight();
    }, []);

    // Initial fetch when component mounts
    useEffect(() => {
        fetchTrainings(true);
    }, []); // Empty dependency array to run only once on mount

    // Add this after your state declarations
    const fetchTrainings = useCallback(async (reset: boolean = false) => {
        try {
            setIsLoading(true);
            const currentPage = reset ? 1 : page;

            const params: Record<string, string> = {
                limit: "3",
                page: currentPage.toString()
            };

            if (sortField) params.sortField = sortField;
            if (sortDirection) params.sortDirection = sortDirection;
            if (searchTerm) params.searchTerm = searchTerm;

            const query = new URLSearchParams(params).toString();
            const response = await fetch(`/api/trainings?${query}`);

            if (!response.ok) throw new Error("Failed to fetch trainings");

            const data = await response.json();

            setTrainings(prev => {
                if (reset) return data.trainings;
                return [...prev, ...data.trainings];
            });

            setPage(currentPage + 1);
            setHasMore(data.trainings.length > 0 && currentPage * Number(params.limit) < data.total);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Error fetching trainings:", error instanceof Error ? error.message : String(error));
        } finally {
            setIsLoading(false);
        }
    }, [page, sortField, sortDirection, searchTerm]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Only check for new data, don't reset the entire view
            if (!isLoading) {
                const checkForNewData = async () => {
                    try {
                        const params: Record<string, string> = {
                            limit: "1",
                            page: "1"
                        };
                        if (sortField) params.sortField = sortField;
                        if (sortDirection) params.sortDirection = sortDirection;
                        if (searchTerm) params.searchTerm = searchTerm;

                        const query = new URLSearchParams(params).toString();
                        const response = await fetch(`/api/trainings?${query}`);

                        if (response.ok) {
                            const data = await response.json();
                            // Only do a full refresh if new data exists
                            if (data.trainings.length > 0 &&
                                (!trainings.length ||
                                    data.trainings[0].date !== trainings[0].date)) {
                                fetchTrainings(true);
                            }
                        }
                    } catch (error) {
                        console.error("Error checking for updates:", error);
                    }
                };
                checkForNewData();
            }
        }, 30000);
        return () => clearInterval(intervalId);
    }, [fetchTrainings, isLoading, sortField, sortDirection, searchTerm, trainings]);

    const lastTrainingElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (isLoading || !hasMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    // Add a small debounce to prevent multiple rapid triggers
                    const timeoutId = setTimeout(() => {
                        fetchTrainings();
                    }, 300);
                    return () => clearTimeout(timeoutId);
                }
            }, {
                // Adjust rootMargin to trigger loading a bit earlier
                rootMargin: '100px'
            });

            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore, fetchTrainings]
    );


    const exerciseStats = useMemo(() => {
        if (trainings.length === 0) return { max: 0, min: 0, avg: 0 };
        const counts = trainings.map((training) => Object.keys(training.exercises).length);
        return {
            max: Math.max(...counts),
            min: Math.min(...counts),
            avg: Math.round(counts.reduce((sum, count) => sum + count, 0) / counts.length),
        };
    }, [trainings]);

    const handleSort = (field: "date" | "pr" | "exercises") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const toggleExpandTraining = (index: number) => {
        setExpandedTraining(expandedTraining === index ? null : index);
    };

    const handleUpdate = (index: number) => {
        if (onUpdateTraining) {
            onUpdateTraining(trainings[index], index);
        } else {
            const training = trainings[index];
            const exercises = Object.entries(training.exercises).map(([name, weight]) => ({
                name,
                weight,
            }));
            setUpdateFormData({ date: training.date, exercises });
            setUpdateFormOpen(index);
        }
    };

    const submitUpdateForm = async () => {
        if (updateFormOpen === null) return;
        const exercisesObject = updateFormData.exercises.reduce((acc, exercise) => {
            if (exercise.name.trim()) acc[exercise.name.trim()] = exercise.weight;
            return acc;
        }, {} as ExerciseData);

        const updatedTraining = { date: updateFormData.date, exercises: exercisesObject };

        try {
            const response = await fetch(`/api/trainings/${encodeURIComponent(updateFormData.date)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ exercises: updatedTraining.exercises }),
            });
            if (!response.ok) throw new Error("Failed to update training");
            const updatedData = await response.json();

            const updatedTrainings = trainings.map((t, i) => (i === updateFormOpen ? updatedData : t));
            setTrainings(updatedTrainings);
            if (onTrainingChange) onTrainingChange(updatedTrainings);
            setUpdateFormOpen(null);
        } catch (error) {
            console.error("Error updating training:", error);
            alert("Failed to update training. Please try again.");
        }
    };

    const handleDelete = (training: TrainingEntry) => {
        setTrainingToDelete(training);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!trainingToDelete) return;

        try {
            const encodedDate = encodeURIComponent(trainingToDelete.date);
            const response = await fetch(`/api/trainings/${encodedDate}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete training");
            }

            const updatedTrainings = trainings.filter((t) => t.date !== trainingToDelete.date);
            setTrainings(updatedTrainings);
            if (onTrainingChange) onTrainingChange(updatedTrainings);
            setTrainingToDelete(null);
            setShowDeleteDialog(false);
        } catch (error) {
            console.error("Error deleting training:", error);
            alert(`Failed to delete training: ${error.message}`);
        }
    };

    const cancelDelete = () => {
        setTrainingToDelete(null);
        setShowDeleteDialog(false);
    };

    return (
        <section className="relative p-5 mt-12 mx-auto bg-stone-400 opacity-60 h-[730px] rounded-[32px] w-[672px] max-md:mx-auto max-md:my-12 max-md:h-auto max-md:w-[90%] max-sm:p-2.5 flex flex-col">
            <h2 className="mt-6 text-4xl italic text-center text-black max-sm:text-3xl">
                Your personal records
            </h2>

            <div className="flex relative items-center mt-16">
                <div className="ml-10 text-3xl text-white max-sm:text-2xl">Current weight</div>
                <div className="absolute text-3xl italic text-white opacity-30 bg-zinc-600 h-[39px] right-[54px] w-[102px] max-sm:text-2xl">
                    {weight !== null ? weight : "Loading..."}
                </div>
            </div>

            <div className="mt-4 mb-2 px-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <input
                        type="text"
                        placeholder="Search by date or exercise"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded bg-white text-black"
                        style={{ minWidth: "210px" }}
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleSort("date")}
                            className={`px-2 py-1 rounded text-black ${sortField === "date" ? "bg-stone-700" : "bg-stone-600"}`}
                        >
                            Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                        </button>
                        <button
                            onClick={() => handleSort("pr")}
                            className={`px-2 py-1 rounded text-black ${sortField === "pr" ? "bg-stone-700" : "bg-stone-600"}`}
                        >
                            PR {sortField === "pr" && (sortDirection === "asc" ? "↑" : "↓")}
                        </button>
                        <button
                            onClick={() => handleSort("exercises")}
                            className={`px-2 py-1 rounded text-black ${sortField === "exercises" ? "bg-stone-700" : "bg-stone-600"}`}
                        >
                            #Exercises {sortField === "exercises" && (sortDirection === "asc" ? "↑" : "↓")}
                        </button>
                    </div>
                </div>
            </div>

            {showDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                        <p className="mb-6">Are you sure you want to delete this training session?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-black rounded-md hover:bg-red-600 transition"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {updateFormOpen !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-screen overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Update Training Session</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Date:</label>
                            <input
                                type="text"
                                value={updateFormData.date}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, date: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Exercises:</label>
                            {updateFormData.exercises.map((exercise, idx) => (
                                <div key={idx} className="flex mb-2 space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Exercise name"
                                        value={exercise.name}
                                        onChange={(e) => {
                                            const updatedExercises = [...updateFormData.exercises];
                                            updatedExercises[idx].name = e.target.value;
                                            setUpdateFormData({ ...updateFormData, exercises: updatedExercises });
                                        }}
                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Weight (kg)"
                                        value={exercise.weight}
                                        onChange={(e) => {
                                            const updatedExercises = [...updateFormData.exercises];
                                            updatedExercises[idx].weight = parseFloat(e.target.value) || 0;
                                            setUpdateFormData({ ...updateFormData, exercises: updatedExercises });
                                        }}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedExercises = updateFormData.exercises.filter((_, i) => i !== idx);
                                            setUpdateFormData({ ...updateFormData, exercises: updatedExercises });
                                        }}
                                        className="px-3 py-2 bg-red-500 text-black rounded-md hover:bg-red-600 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setUpdateFormData({ ...updateFormData, exercises: [...updateFormData.exercises, { name: "", weight: 0 }] })}
                                className="mt-2 px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600 transition"
                            >
                                Add Exercise
                            </button>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                                onClick={() => setUpdateFormOpen(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-600 transition"
                                onClick={submitUpdateForm}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto max-h-96 mt-2">
                {trainings.length === 0 ? (
                    <p className="text-center text-white text-xl">No training sessions added yet.</p>
                ) : (
                    trainings.map((training, index) => {
                        const prExercise = Object.entries(training.exercises).reduce(
                            (a, b) => (a[1] > b[1] ? a : b),
                            ["", 0]
                        );
                        const prText = `${prExercise[0]}: ${prExercise[1]} kg`;
                        const exerciseCount = Object.keys(training.exercises).length;

                        let statHighlight = "bg-stone-600";
                        if (exerciseCount === exerciseStats.max) statHighlight = "bg-green-700";
                        else if (exerciseCount === exerciseStats.min) statHighlight = "bg-red-700";
                        else if (exerciseCount === exerciseStats.avg) statHighlight = "bg-orange-500";

                        return (
                            <div
                                key={index}
                                ref={index === trainings.length - 1 ? lastTrainingElementRef : null}
                                className={`mb-4 bg-stone-500 rounded-lg overflow-hidden ${expandedTraining === index ? "border-2 border-white" : ""}`}
                            >
                                <div className={`p-3 ${statHighlight}`}>
                                    <div className="flex justify-between items-center">
                                        <div
                                            className="flex items-center cursor-pointer flex-grow"
                                            onClick={() => toggleExpandTraining(index)}
                                        >
                                            <span className="text-white font-bold mr-2 whitespace-nowrap">
                                                {training.date}
                                            </span>
                                            <span className="text-white mr-2 truncate max-w-xs">
                                                Exercises: {exerciseCount} | PR: {prText}
                                            </span>
                                            <span className="text-white">
                                                {expandedTraining === index ? "▲" : "▼"}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 flex-shrink-0">
                                            <button
                                                className="text-sm px-2 py-0.5 bg-blue-500 text-black rounded-md hover:bg-blue-600 transition whitespace-nowrap"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdate(index);
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="text-sm px-2 py-0.5 bg-red-500 text-black rounded-md hover:bg-red-600 transition whitespace-nowrap"
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
                                {expandedTraining === index && (
                                    <div className="p-4 bg-stone-500">
                                        <h4 className="text-white font-semibold mb-2">Exercises:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.entries(training.exercises).map(([exercise, weight], idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-stone-600 p-2 rounded flex justify-between"
                                                >
                                                    <span className="text-white truncate mr-2">{exercise}</span>
                                                    <span className="text-white font-bold whitespace-nowrap">
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
                    {isLoading && <p className="text-center text-white">Loading more trainings...</p>}
                    {!hasMore && trainings.length > 0 && (
                        <p className="text-center text-white">No more trainings to load.</p>
                    )}
            </div>

            <div className="flex justify-center space-x-4 text-sm text-white mb-2">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-700 rounded-full mr-1"></div>
                    <span>Most exercises ({exerciseStats.max})</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-700 rounded-full mr-1"></div>
                    <span>Average ({exerciseStats.avg})</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-700 rounded-full mr-1"></div>
                    <span>Least exercises ({exerciseStats.min})</span>
                </div>
            </div>

            <div className="mt-5">
                <button
                    className="w-full mt-2.5 text-3xl italic text-center text-black max-sm:text-2xl"
                    onClick={onNavigateToTrainingSelector}
                >
                    Add training session
                </button>
                <button
                    className="w-full mt-2.5 text-3xl italic text-center text-black max-sm:text-2xl"
                    onClick={onNavigateToMetricsSection}
                >
                    Edit Metrics
                </button>
            </div>

            <div className="absolute h-px bg-indigo-700 left-[110px] top-[107px] w-[510px] max-sm:w-4/5 max-sm:left-[10%]" />
        </section>
    );
};

export default PersonalRecordsCard;