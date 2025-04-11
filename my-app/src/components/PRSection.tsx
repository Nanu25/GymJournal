"use client";
import React, { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
} from "recharts";

interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

// Colors for the pie chart segments
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface PRSectionProps {
    trainings: TrainingEntry[];
}

interface PieChartData {
    name: string;
    value: number;
}

interface LineChartData {
    date: string;
    weight: number;
}

interface BarChartData {
    date: string;
    totalWeight: number;
}

const PRSection: React.FC<PRSectionProps> = ({ trainings = [] }) => {
    const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
    const [lineChartData, setLineChartData] = useState<LineChartData[]>([]);
    const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [exerciseList, setExerciseList] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch pie chart data (Muscle Group Distribution)
    useEffect(() => {
        const fetchMuscleGroupData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 100));

                const response = await fetch('/api/trainings/muscle-group-distribution');

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                setPieChartData(data);
            } catch (error) {
                console.error('Error fetching muscle group distribution:', error);
            }
        };

        fetchMuscleGroupData();
    }, [trainings]); // Only fetch once on component mount or add dependencies if needed

    // Update the useEffect in your PRSection.tsx
    useEffect(() => {
        if (selectedExercise) {
            // Show loading state if needed
            setIsLoading(true);

            // Fetch data from the backend
            fetch(`/api/trainings/exercise-progress/${encodeURIComponent(selectedExercise)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch exercise progress data');
                    }
                    return response.json();
                })
                .then(data => {
                    setLineChartData(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching exercise progress:', error);
                    setLineChartData([]);
                    setIsLoading(false);
                });
        } else {
            setLineChartData([]);
        }
    }, [selectedExercise]);

    // Update the useEffect for bar chart data
    useEffect(() => {
        const fetchTotalWeightData = async () => {
            try {
                const response = await fetch("/api/trainings/total-weight");
                if (!response.ok) throw new Error("Failed to fetch total weight data");
                const data = await response.json();
                setBarChartData(data);
            } catch (error) {
                console.error("Error fetching total weight data:", error);
            }
        };

        fetchTotalWeightData();
    }, [trainings]); // Add trainings as dependency to re-fetch when data changes

    // Update the exercise list with backend data
    useEffect(() => {
        const fetchExerciseList = async () => {
            try {
                const response = await fetch("/api/trainings/exercises");
                if (!response.ok) throw new Error("Failed to fetch exercise list");
                const data = await response.json();
                setExerciseList(data);
            } catch (error) {
                console.error("Error fetching exercise list:", error);
            }
        };

        fetchExerciseList();
    }, [trainings]); // Add trainings as dependency

    return (
        <aside className="h-full">
            <div className="sticky top-4">
                <div className="relative">
                    <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-[32px] shadow-2xl border border-stone-700/30 overflow-hidden">
                        <div className="p-8">
                            {/* Pie Chart: Muscle Group Distribution */}
                            <div className="mb-8">
                                <h4 className="text-2xl font-bold text-white mb-6">Muscle Group Distribution</h4>
                                {pieChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] bg-stone-800/50 rounded-xl border border-stone-700/30">
                                        <p className="text-stone-400">No data available</p>
                                    </div>
                                )}
                            </div>

                            {/* Line Chart: Progress Over Time */}
                            <div className="mb-8">
                                <h4 className="text-2xl font-bold text-white mb-6">Progress Over Time</h4>
                                <select
                                    className="w-full px-4 py-3 mb-4 bg-stone-800/50 border border-stone-700/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    value={selectedExercise || ""}
                                    onChange={(e) => setSelectedExercise(e.target.value)}
                                >
                                    <option value="">Select an exercise</option>
                                    {exerciseList.map((exercise) => (
                                        <option key={exercise} value={exercise}>
                                            {exercise}
                                        </option>
                                    ))}
                                </select>
                                {lineChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={lineChartData}>
                                            <Line 
                                                type="monotone" 
                                                dataKey="weight" 
                                                stroke="#3B82F6"
                                                strokeWidth={2}
                                                dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                                            />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#9CA3AF"
                                                tick={{ fill: "#9CA3AF" }}
                                            />
                                            <YAxis 
                                                stroke="#9CA3AF"
                                                tick={{ fill: "#9CA3AF" }}
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: "#1F2937",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    borderRadius: "8px"
                                                }}
                                                labelStyle={{ color: "#9CA3AF" }}
                                                itemStyle={{ color: "#3B82F6" }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[200px] bg-stone-800/50 rounded-xl border border-stone-700/30">
                                        <p className="text-stone-400">
                                            {selectedExercise ? "No data for selected exercise" : "Select an exercise to view progress"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Bar Chart: Total Weight Per Session */}
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-6">Total Weight Per Session</h4>
                                {barChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={barChartData}>
                                            <Bar 
                                                dataKey="totalWeight" 
                                                fill="#3B82F6"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#9CA3AF"
                                                tick={{ fill: "#9CA3AF" }}
                                            />
                                            <YAxis 
                                                stroke="#9CA3AF"
                                                tick={{ fill: "#9CA3AF" }}
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: "#1F2937",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    borderRadius: "8px"
                                                }}
                                                labelStyle={{ color: "#9CA3AF" }}
                                                itemStyle={{ color: "#3B82F6" }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[200px] bg-stone-800/50 rounded-xl border border-stone-700/30">
                                        <p className="text-stone-400">No data available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default PRSection;