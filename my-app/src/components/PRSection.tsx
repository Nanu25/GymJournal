import React, { useEffect, useState } from "react";
import { trainingService, TotalWeightData } from "../services/trainingService";
import MuscleGroupChart from "./MuscleGroupChart";
import ProgressChart from "./ProgressChart";
import TotalWeightChart from "./TotalWeightChart";
import TrainingHeatmap from "./TrainingHeatmap";
import MuscleBalanceRadar from "./MuscleBalanceRadar";

interface PieChartData {
    name: string;
    value: number;
}

interface LineChartData {
    date: string;
    weight: number;
}

const PRSection: React.FC = () => {
    const [muscleGroupData, setMuscleGroupData] = useState<PieChartData[]>([]);
    const [progressData, setProgressData] = useState<LineChartData[]>([]);
    const [totalWeightData, setTotalWeightData] = useState<TotalWeightData[]>([]);
    const [exerciseList, setExerciseList] = useState<string[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
    const [trainingDates, setTrainingDates] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Muscle Group Distribution
                const muscleData = await trainingService.getMuscleGroupDistribution();
                const formattedMuscleData = Object.entries(muscleData)
                    .map(([name, value]) => ({
                        name,
                        value: Number(value) || 0
                    }))
                    .filter(item => item.value > 0);

                if (formattedMuscleData.length === 0) {
                    formattedMuscleData.push({
                        name: "No exercises recorded",
                        value: 1
                    });
                }
                setMuscleGroupData(formattedMuscleData);

                // Fetch Total Weight Per Session
                const weightData = await trainingService.getTotalWeightPerSession();
                setTotalWeightData(weightData);

                // Fetch All Trainings for Heatmap & Progress
                const trainings = await trainingService.getAllTrainings();

                // Extract dates for Heatmap
                const dates = trainings.map(t => t.date);
                setTrainingDates(dates);

                // Extract Exercises for Progress Chart
                const exercises = new Set<string>();
                trainings.forEach(training => {
                    Object.keys(training.exercises).forEach(ex => exercises.add(ex));
                });
                const uniqueExercises = Array.from(exercises).sort();
                setExerciseList(uniqueExercises);

                if (uniqueExercises.length > 0 && !selectedExercise) {
                    setSelectedExercise(uniqueExercises[0]);
                }

            } catch (error) {
                console.error("Error fetching analytics data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchProgressData = async () => {
            if (!selectedExercise) {
                setProgressData([]);
                return;
            }

            try {
                const trainings = await trainingService.getAllTrainings();

                const data: LineChartData[] = trainings
                    .filter(t => t.exercises[selectedExercise] !== undefined)
                    .map(t => ({
                        date: t.date,
                        weight: t.exercises[selectedExercise]
                    }))
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                setProgressData(data);
            } catch (error) {
                console.error("Error fetching progress data:", error);
            }
        };

        fetchProgressData();
    }, [selectedExercise]);

    return (
        <div className="w-full space-y-8 pb-8">
            {/* Consistency Heatmap - Full Width */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <TrainingHeatmap dates={trainingDates} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Muscle Group Distribution Chart */}
                <MuscleGroupChart data={muscleGroupData} />

                {/* Muscle Balance Radar Chart */}
                <MuscleBalanceRadar data={muscleGroupData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Progress Over Time Chart */}
                <ProgressChart
                    data={progressData}
                    selectedExercise={selectedExercise}
                    exerciseList={exerciseList}
                    onExerciseChange={setSelectedExercise}
                />

                {/* Total Volume Chart */}
                <TotalWeightChart data={totalWeightData} />
            </div>
        </div>
    );
};

export default PRSection;