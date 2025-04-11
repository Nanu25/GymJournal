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

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

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
                    <div className="bg-[#0f172a] rounded-[32px] shadow-[0_0_50px_0_rgba(8,_112,_184,_0.7)] border border-blue-500/10 overflow-hidden backdrop-blur-xl">
                        <div className="p-8">
                            {/* Pie Chart: Muscle Group Distribution */}
                            <div className="mb-12">
                                <div className="flex items-center mb-6">
                                    <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-4"></div>
                                    <h4 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                        Muscle Group Distribution
                                    </h4>
                                </div>
                                {pieChartData.length > 0 ? (
                                    <div className="bg-[#1a2234] p-6 rounded-2xl border border-blue-500/10">
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
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-[300px] bg-[#1a2234] rounded-2xl border border-blue-500/10">
                                        <p className="text-blue-300">No data available</p>
                                    </div>
                                )}
                            </div>

                            {/* Line Chart: Progress Over Time */}
                            <div className="mb-12">
                                <div className="flex items-center mb-6">
                                    <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full mr-4"></div>
                                    <h4 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                                        Progress Over Time
                                    </h4>
                                </div>
                                <select
                                    className="w-full px-6 py-4 mb-6 bg-[#1a2234] border border-blue-500/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
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
                                    <div className="bg-[#1a2234] p-6 rounded-2xl border border-blue-500/10">
                                        <ResponsiveContainer width="100%" height={200}>
                                            <LineChart data={lineChartData}>
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="weight" 
                                                    stroke="#10B981"
                                                    strokeWidth={3}
                                                    dot={{ fill: "#10B981", strokeWidth: 2 }}
                                                />
                                                <XAxis 
                                                    dataKey="date" 
                                                    stroke="#64748B"
                                                    tick={{ fill: "#64748B" }}
                                                />
                                                <YAxis 
                                                    stroke="#64748B"
                                                    tick={{ fill: "#64748B" }}
                                                />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: "#1a2234",
                                                        border: "1px solid rgba(59, 130, 246, 0.1)",
                                                        borderRadius: "12px"
                                                    }}
                                                    labelStyle={{ color: "#64748B" }}
                                                    itemStyle={{ color: "#10B981" }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-[200px] bg-[#1a2234] rounded-2xl border border-blue-500/10">
                                        <p className="text-blue-300">
                                            {selectedExercise ? "No data for selected exercise" : "Select an exercise to view progress"}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Bar Chart: Total Weight Per Session */}
                            <div>
                                <div className="flex items-center mb-6">
                                    <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full mr-4"></div>
                                    <h4 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                        Total Weight Per Session
                                    </h4>
                                </div>
                                {barChartData.length > 0 ? (
                                    <div className="bg-[#1a2234] p-6 rounded-2xl border border-blue-500/10">
                                        <ResponsiveContainer width="100%" height={200}>
                                            <BarChart data={barChartData}>
                                                <Bar 
                                                    dataKey="totalWeight" 
                                                    fill="url(#barGradient)"
                                                    radius={[6, 6, 0, 0]}
                                                />
                                                <XAxis 
                                                    dataKey="date" 
                                                    stroke="#64748B"
                                                    tick={{ fill: "#64748B" }}
                                                />
                                                <YAxis 
                                                    stroke="#64748B"
                                                    tick={{ fill: "#64748B" }}
                                                />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: "#1a2234",
                                                        border: "1px solid rgba(59, 130, 246, 0.1)",
                                                        borderRadius: "12px"
                                                    }}
                                                    labelStyle={{ color: "#64748B" }}
                                                    itemStyle={{ color: "#8B5CF6" }}
                                                />
                                                <defs>
                                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1}/>
                                                        <stop offset="100%" stopColor="#6D28D9" stopOpacity={1}/>
                                                    </linearGradient>
                                                </defs>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-[200px] bg-[#1a2234] rounded-2xl border border-blue-500/10">
                                        <p className="text-blue-300">No data available</p>
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