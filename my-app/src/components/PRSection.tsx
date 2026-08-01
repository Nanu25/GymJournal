import React, { useState, useMemo, useEffect } from "react";

import MuscleGroupChart from "./MuscleGroupChart";
import ProgressChart from "./ProgressChart";
import TotalWeightChart from "./TotalWeightChart";
import TrainingHeatmap from "./TrainingHeatmap";
import MuscleBalanceRadar from "./MuscleBalanceRadar";
import { useStats } from "../hooks/useStats";

interface PieChartData {
    name: string;
    value: number;
}

const PRSection: React.FC = () => {
    const {
        useMuscleDistribution,
        useTotalWeight,
        useTrainingDates,
        useExerciseProgress,
        useUniqueExercises
    } = useStats();

    const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

    // Fetch Data using Hooks
    const { data: muscleGroupDataRaw } = useMuscleDistribution();
    const { data: totalWeightData = [] } = useTotalWeight();
    const { data: trainingDates = [] } = useTrainingDates();
    const { data: exerciseList = [] } = useUniqueExercises();
    const { data: progressData = [] } = useExerciseProgress(selectedExercise);

    // Set initial selected exercise
    useEffect(() => {
        if (exerciseList.length > 0 && !selectedExercise) {
            setSelectedExercise(exerciseList[0]);
        }
    }, [exerciseList, selectedExercise]);

    // Format Muscle Group Data
    const muscleGroupData: PieChartData[] = useMemo(() => {
        if (!muscleGroupDataRaw) return [];

        const formatted = Object.entries(muscleGroupDataRaw)
            .map(([name, value]) => ({
                name,
                value: Number(value) || 0
            }))
            .filter(item => item.value > 0);

        if (formatted.length === 0) {
            formatted.push({
                name: "No exercises recorded",
                value: 1
            });
        }
        return formatted;
    }, [muscleGroupDataRaw]);

    return (
        <div className="w-full space-y-8 pb-8">
            {/* Consistency Heatmap - Full Width */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <TrainingHeatmap dates={trainingDates} />
            </div>

            {/* Charts Grid - Side by Side on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MuscleGroupChart data={muscleGroupData} />
                <MuscleBalanceRadar data={muscleGroupData} />
            </div>

            <div className="space-y-8">
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