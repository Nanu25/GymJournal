"use client";

import React, { useState } from "react";

interface ExerciseData {
    [key: string]: number;
}

interface TrainingEntry {
    date: string;
    exercises: ExerciseData;
}

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
            console.log("Update functionality not implemented yet");
        }
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
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow overflow-y-auto max-h-96 mt-6">
                {trainings.length === 0 ? (
                    <p className="text-center text-white text-xl">No training sessions added yet.</p>
                ) : (
                    trainings.map((training, index) => {
                        const prExercise = Object.entries(training.exercises).reduce(
                            (a, b) => (a[1] > b[1] ? a : b)
                        );
                        const prText = `${prExercise[0]}: ${prExercise[1]} kg`;

                        return (
                            <div
                                key={index}
                                className={`mb-4 bg-stone-500 rounded-lg overflow-hidden ${expandedTraining === index ? 'border-2 border-white' : ''}`}
                            >
                                {/* Training header with toggle and delete */}
                                <div className="p-3 bg-stone-600">
                                    <div className="flex justify-between items-center">
                                        <div
                                            className="flex items-center cursor-pointer flex-grow"
                                            onClick={() => toggleExpandTraining(index)}
                                        >
                                            <span className="text-white font-bold mr-2 whitespace-nowrap">{training.date}</span>
                                            <span className="text-white mr-2 truncate max-w-xs">
                                                Exercises: {Object.keys(training.exercises).length} | PR: {prText}
                                            </span>
                                            <span className="text-white">
                                                {expandedTraining === index ? '▲' : '▼'}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 flex-shrink-0">
                                            <button
                                                className="text-sm px-2 py-0.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition whitespace-nowrap"
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
                                                    handleDelete(index);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded view with all exercises */}
                                {expandedTraining === index && (
                                    <div className="p-4 bg-stone-500">
                                        <h4 className="text-white font-semibold mb-2">Exercises:</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.entries(training.exercises).map(([exercise, weight], idx) => (
                                                <div key={idx}
                                                     className="bg-stone-600 p-2 rounded flex justify-between">
                                                    <span className="text-white truncate mr-2">{exercise}</span>
                                                    <span
                                                        className="text-white font-bold whitespace-nowrap">{weight} kg</span>
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

            <div className="mt-auto mb-5">
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