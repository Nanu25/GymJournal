"use client";

import React, { useState, useMemo, useEffect } from "react";
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
        pageClassName={"px-3 py-1 bg-stone-600 text-white rounded-md hover:bg-stone-700"}
        previousClassName={"px-3 py-1 bg-stone-600 text-white rounded-md hover:bg-stone-700"}
        nextClassName={"px-3 py-1 bg-stone-600 text-white rounded-md hover:bg-stone-700"}
        breakClassName={"px-3 py-1"}
        activeClassName={"bg-stone-800"}
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

const PersonalRecordsCard: React.FC<{
    trainings: TrainingEntry[];
    setTrainings: React.Dispatch<React.SetStateAction<TrainingEntry[]>>;
    onNavigateToMetricsSection: () => void;
    onNavigateToTrainingSelector: () => void;
    weight: number;
    onUpdateTraining?: (training: TrainingEntry, index: number) => void;
}> = ({
          trainings,
          setTrainings,
          onNavigateToMetricsSection,
          onNavigateToTrainingSelector,
          weight,
          onUpdateTraining,
      }) => {
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
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
    const itemsPerPage = 3;

    const filteredAndSortedTrainings = useMemo(() => {
        const indexedTrainings = trainings.map((training, index) => ({
            training,
            originalIndex: index,
        }));

        let result = indexedTrainings;
        if (searchTerm) {
            result = result.filter(({ training }) =>
                training.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                Object.keys(training.exercises).some((exercise) =>
                    exercise.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (sortField) {
            result = [...result].sort((a, b) => {
                const trainingA = a.training;
                const trainingB = b.training;
                let comparison = 0;

                if (sortField === "date") {
                    comparison = trainingA.date.localeCompare(trainingB.date);
                } else if (sortField === "pr") {
                    const prA = Object.values(trainingA.exercises).length > 0
                        ? Math.max(...Object.values(trainingA.exercises))
                        : 0;
                    const prB = Object.values(trainingB.exercises).length > 0
                        ? Math.max(...Object.values(trainingB.exercises))
                        : 0;
                    comparison = prA - prB;
                } else if (sortField === "exercises") {
                    comparison = Object.keys(trainingA.exercises).length - Object.keys(trainingB.exercises).length;
                }

                return sortDirection === "asc" ? comparison : -comparison;
            });
        }

        return result;
    }, [trainings, searchTerm, sortField, sortDirection]);

    const pageCount = Math.ceil(filteredAndSortedTrainings.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTrainings = filteredAndSortedTrainings.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm, sortField, sortDirection]);

    useEffect(() => {
        if (pageCount > 0 && currentPage >= pageCount) {
            setCurrentPage(pageCount - 1);
        } else if (pageCount === 0) {
            setCurrentPage(0);
        }
    }, [pageCount]);

    const handleDelete = (index: number) => {
        setDeleteConfirm(index);
    };

    const confirmDelete = () => {
        if (deleteConfirm !== null) {
            const updatedTrainings = [...trainings];
            updatedTrainings.splice(deleteConfirm, 1);
            setTrainings(updatedTrainings);
            setDeleteConfirm(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
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
            setUpdateFormData({
                date: training.date,
                exercises,
            });
            setUpdateFormOpen(index);
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

    const submitUpdateForm = () => {
        if (updateFormOpen !== null) {
            const exercisesObject: ExerciseData = {};
            updateFormData.exercises.forEach((exercise) => {
                if (exercise.name.trim()) {
                    exercisesObject[exercise.name.trim()] = exercise.weight;
                }
            });

            const updatedTraining: TrainingEntry = {
                date: updateFormData.date,
                exercises: exercisesObject,
            };

            const updatedTrainings = [...trainings];
            updatedTrainings[updateFormOpen] = updatedTraining;
            setTrainings(updatedTrainings);
            setUpdateFormOpen(null);
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

    return (
        <section
            className="relative p-5 mt-12 mx-auto bg-stone-400 opacity-60 h-[703px] rounded-[32px] w-[672px] max-md:mx-auto max-md:my-12 max-md:h-auto max-md:w-[90%] max-sm:p-2.5 flex flex-col"
        >
            <h2 className="mt-6 text-4xl italic text-center text-black max-sm:text-3xl">
                Your personal records
            </h2>

            <div className="flex relative items-center mt-16">
                <div className="ml-10 text-3xl text-white max-sm:text-2xl">
                    Current weight
                </div>
                <div
                    className="absolute text-3xl italic text-white opacity-30 bg-zinc-600 h-[39px] right-[54px] w-[102px] max-sm:text-2xl"
                >
                    {weight}
                </div>
            </div>

            {/* Filter Bar */}
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
                            className={`px-2 py-1 rounded text-black ${
                                sortField === "date" ? "bg-stone-700" : "bg-stone-600"
                            }`}
                        >
                            Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                        </button>
                        <button
                            onClick={() => handleSort("pr")}
                            className={`px-2 py-1 rounded text-black ${
                                sortField === "pr" ? "bg-stone-700" : "bg-stone-600"
                            }`}
                        >
                            PR {sortField === "pr" && (sortDirection === "asc" ? "↑" : "↓")}
                        </button>
                        <button
                            onClick={() => handleSort("exercises")}
                            className={`px-2 py-1 rounded text-black ${
                                sortField === "exercises" ? "bg-stone-700" : "bg-stone-600"
                            }`}
                        >
                            #Exercises {sortField === "exercises" && (sortDirection === "asc" ? "↑" : "↓")}
                        </button>
                    </div>
                </div>
            </div>

            {deleteConfirm !== null && (
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
                                onChange={(e) => handleUpdateInputChange(e, "date")}
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
                                        onChange={(e) => handleExerciseNameChange(idx, e.target.value)}
                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="number min=0"
                                        placeholder="Weight (kg)"
                                        value={exercise.weight}
                                        onChange={(e) => handleExerciseWeightChange(idx, e.target.value)}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExerciseField(idx)}
                                        className="px-3 py-2 bg-red-500 text-black rounded-md hover:bg-red-600 transition"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addExerciseField}
                                className="mt-2 px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600 transition"
                            >
                                Add Exercise
                            </button>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                                onClick={cancelUpdateForm}
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
                {filteredAndSortedTrainings.length === 0 ? (
                    trainings.length === 0 ? (
                        <p className="text-center text-white text-xl">No training sessions added yet.</p>
                    ) : (
                        <p className="text-center text-white text-xl">No matching training sessions found.</p>
                    )
                ) : (
                    currentTrainings.map(({ training, originalIndex }) => {
                        const prExercise = Object.entries(training.exercises).reduce(
                            (a, b) => (a[1] > b[1] ? a : b),
                            ["", 0]
                        );
                        const prText = `${prExercise[0]}: ${prExercise[1]} kg`;

                        return (
                            <div
                                key={originalIndex}
                                className={`mb-4 bg-stone-500 rounded-lg overflow-hidden ${
                                    expandedTraining === originalIndex ? "border-2 border-white" : ""
                                }`}
                            >
                                <div className="p-3 bg-stone-600">
                                    <div className="flex justify-between items-center">
                                        <div
                                            className="flex items-center cursor-pointer flex-grow"
                                            onClick={() => toggleExpandTraining(originalIndex)}
                                        >
                                            <span className="text-white font-bold mr-2 whitespace-nowrap">
                                                {training.date}
                                            </span>
                                            <span className="text-white mr-2 truncate max-w-xs">
                                                Exercises: {Object.keys(training.exercises).length} | PR: {prText}
                                            </span>
                                            <span className="text-white">
                                                {expandedTraining === originalIndex ? "▲" : "▼"}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 flex-shrink-0">
                                            <button
                                                className="text-sm px-2 py-0.5 bg-blue-500 text-black rounded-md hover:bg-blue-600 transition whitespace-nowrap"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdate(originalIndex);
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="text-sm px-2 py-0.5 bg-red-500 text-black rounded-md hover:bg-red-600 transition whitespace-nowrap"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(originalIndex);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {expandedTraining === originalIndex && (
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
            </div>

            <Pagination pageCount={pageCount} onPageChange={handlePageChange} />

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

            <div
                className="absolute h-px bg-indigo-700 left-[110px] top-[107px] w-[510px] max-sm:w-4/5 max-sm:left-[10%]"
            />
        </section>
    );
};

export default PersonalRecordsCard;