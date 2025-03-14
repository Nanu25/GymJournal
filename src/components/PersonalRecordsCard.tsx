"use client";

import React from "react";
import TrainingSession from "./TrainingSession";

interface ExerciseData {
    [key: string]: number;
}

interface TrainingEntry {
    date: string;
    exercises: ExerciseData;
}

function addExerciseToTrainings(
    trainings: TrainingEntry[],
    exerciseName: string,
    initialValue: number
): TrainingEntry[] {
    return trainings.map((training) => ({
        ...training,
        exercises: {
            ...training.exercises,
            [exerciseName]: initialValue,
        },
    }));
}

const PersonalRecordsCard: React.FC<{
    trainings: TrainingEntry[];
    setTrainings: React.Dispatch<React.SetStateAction<TrainingEntry[]>>;
    onNavigateToMetricsSection: () => void;
    onNavigateToTrainingSelector: () => void;
    weight: number;
}> = ({
          trainings,
          setTrainings,
          onNavigateToMetricsSection,
          onNavigateToTrainingSelector,
          weight,
      }) => {
    // Handle adding a new training session directly with a prompt
    const handleAddTrainingSession = () => {
        const trainingName = prompt("Enter the name of the new training session:");
        if (trainingName) {
            const newTraining: TrainingEntry = {
                date: new Date().toISOString().split("T")[0], // Current date
                exercises: {
                    "Default Exercise": 10, // Default exercise with a starting weight
                },
            };
            setTrainings([...trainings, newTraining]);
        }
    };

    return (
        <section
            className="relative p-5 mt-12 mx-auto bg-stone-400 opacity-60 h-[703px] rounded-[32px] w-[672px] max-md:mx-auto max-md:my-12 max-md:h-auto max-md:w-[90%] max-sm:p-2.5 flex flex-col"
        >
            <h2 className="mt-6 text-4xl italic text-center text-black max-sm:text-3xl">
                Your personal records
            </h2>

            <div className="flex relative items-center mt-24">
                <div className="ml-10 text-3xl text-white max-sm:text-2xl">
                    Current weight
                </div>
                <div
                    className="absolute text-3xl italic text-white opacity-30 bg-zinc-600 h-[39px] right-[54px] w-[102px] max-sm:text-2xl"
                >
                    {weight}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto max-h-96">
                {trainings.length === 0 ? (
                    <p className="text-center text-white">No training sessions added yet.</p>
                ) : (
                    trainings.map((training, index) => {
                        const prExercise = Object.entries(training.exercises).reduce(
                            (a, b) => (a[1] > b[1] ? a : b)
                        );
                        const prText = `${prExercise[0]}: ${prExercise[1]} kg`;
                        const trainingText = `${training.date}: exercises: ${Object.keys(training.exercises).length}, PR: ${prText}`;
                        return <TrainingSession key={index} text={trainingText} />;
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