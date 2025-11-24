import React, { useState, useEffect, useMemo } from "react";
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
    CartesianGrid,
    Area,
} from "recharts";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#F472B6", "#22D3EE", "#FB923C", "#C084FC", "#C026D3"];

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

const PRSection: React.FC<PRSectionProps> = ({ trainings }) => {
    const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
    const [lineChartData, setLineChartData] = useState<LineChartData[]>([]);
    const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [exerciseList, setExerciseList] = useState<string[]>([]);

    // Scroll reveal hooks for each chart
    const { elementRef: pieChartRef, isVisible: isPieVisible } = useRevealOnScroll({ threshold: 0.2 });
    const { elementRef: lineChartRef, isVisible: isLineVisible } = useRevealOnScroll({ threshold: 0.2 });
    const { elementRef: barChartRef, isVisible: isBarVisible } = useRevealOnScroll({ threshold: 0.2 });
    const exerciseProgressMap = useMemo(() => {
        const map: Record<string, LineChartData[]> = {};
        trainings.forEach(training => {
            const trainingDate = training.date;
            Object.entries(training.exercises).forEach(([exerciseName, weight]) => {
                if (!map[exerciseName]) {
                    map[exerciseName] = [];
                }
                map[exerciseName].push({
                    date: trainingDate,
                    weight: Number(weight) || 0,
                });
            });
        });
        Object.values(map).forEach(entries => {
            entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        });
        return map;
    }, [trainings]);

    // Fetch pie chart data (Muscle Group Distribution)
    useEffect(() => {
        const fetchMuscleGroupData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }

                const response = await fetch('/api/trainings/muscle-group-distribution', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                // Transform the data into the correct format for the pie chart and filter out NaN values
                const transformedData = Object.entries(data)
                    .map(([name, value]) => ({
                        name,
                        value: Number(value) || 0  // Convert NaN to 0
                    }))
                    .filter(item => item.value > 0); // Only include items with values greater than 0

                // If no valid data, add a placeholder
                if (transformedData.length === 0) {
                    transformedData.push({
                        name: "No exercises recorded",
                        value: 1
                    });
                }

                setPieChartData(transformedData);
            } catch (error) {
                console.error('Error fetching muscle group distribution:', error);
            }
        };

        fetchMuscleGroupData();
    }, [trainings]);

    useEffect(() => {
        const exercises = Object.keys(exerciseProgressMap).sort();
        setExerciseList(exercises);
        if (!selectedExercise && exercises.length > 0) {
            setSelectedExercise(exercises[0]);
        } else if (selectedExercise && !exercises.includes(selectedExercise)) {
            setSelectedExercise(exercises[0] || null);
        }
    }, [exerciseProgressMap, selectedExercise]);

    useEffect(() => {
        if (selectedExercise) {
            setLineChartData(exerciseProgressMap[selectedExercise] || []);
        } else {
            setLineChartData([]);
        }
    }, [selectedExercise, exerciseProgressMap]);

    // Update the useEffect for bar chart data
    useEffect(() => {
        const fetchTotalWeightData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }

                const response = await fetch("/api/trainings/total-weight", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch total weight data");
                }

                const data = await response.json();
                setBarChartData(data);
            } catch (error) {
                console.error("Error fetching total weight data:", error);
            }
        };

        fetchTotalWeightData();
    }, [trainings]);

    return (
        <div className="w-full space-y-8 pb-8">
            {/* Pie Chart: Muscle Group Distribution */}
            <div
                ref={pieChartRef}
                className={`w-full p-6 sm:p-8 rounded-3xl bg-[#1e293b]/50 border border-white/5 backdrop-blur-sm shadow-xl overflow-hidden transition-all duration-1000 ease-out ${isPieVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
            >
                <div className="flex items-center mb-8">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    <h4 className="text-xl font-bold text-white tracking-wide">
                        Muscle Group Distribution
                    </h4>
                </div>
                {pieChartData.length > 0 ? (
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height={450} className="min-h-[450px]">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={140}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={8}
                                >
                                    {pieChartData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            className="cursor-pointer hover:opacity-80 transition-opacity duration-300 outline-none"
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ payload }) => {
                                        if (payload && payload.length > 0) {
                                            const data = payload[0];
                                            return (
                                                <div className="bg-[#0f172a]/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl">
                                                    <p className="text-white font-bold text-lg mb-1">{data.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.fill }}></div>
                                                        <p className="text-gray-300">
                                                            {data.value} exercises
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {pieChartData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-sm text-gray-300">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[450px] min-h-[450px] bg-white/5 rounded-xl border border-dashed border-white/10">
                        <p className="text-gray-400 text-lg">No data available</p>
                    </div>
                )}
            </div>

            {/* Line Chart: Progress Over Time */}
            <div
                ref={lineChartRef}
                className={`w-full p-6 sm:p-8 rounded-3xl bg-[#1e293b]/50 border border-white/5 backdrop-blur-sm shadow-xl overflow-hidden transition-all duration-1000 ease-out delay-200 ${isLineVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full mr-4 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                        <h4 className="text-xl font-bold text-white tracking-wide">
                            Progress Over Time
                        </h4>
                    </div>
                    <div className="relative">
                        <select
                            className="w-full md:w-64 px-4 py-2.5 bg-[#0f172a]/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 appearance-none cursor-pointer hover:bg-[#0f172a]/70"
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
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {lineChartData.length > 0 ? (
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height={400} className="min-h-[400px]">
                            <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94A3B8"
                                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#94A3B8"
                                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}kg`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: "12px",
                                        backdropFilter: "blur(12px)",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                                    }}
                                    labelStyle={{ color: "#94A3B8", marginBottom: "0.5rem" }}
                                    itemStyle={{ color: "#10B981", fontWeight: 600 }}
                                    formatter={(value: number) => [`${value}kg`, 'Weight']}
                                    labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="weight" stroke="none" fill="url(#lineGradient)" />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    dot={{ fill: "#0f172a", stroke: "#10B981", strokeWidth: 3, r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: "#34D399" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[400px] min-h-[400px] bg-white/5 rounded-xl border border-dashed border-white/10">
                        <p className="text-gray-400 text-lg">
                            {selectedExercise ? "No data for selected exercise" : "Select an exercise to view progress"}
                        </p>
                    </div>
                )}
            </div>

            {/* Bar Chart: Total Weight Per Session */}
            <div
                ref={barChartRef}
                className={`w-full p-6 sm:p-8 rounded-3xl bg-[#1e293b]/50 border border-white/5 backdrop-blur-sm shadow-xl overflow-hidden transition-all duration-1000 ease-out delay-300 ${isBarVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                    }`}
            >
                <div className="flex items-center mb-8">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full mr-4 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
                    <h4 className="text-xl font-bold text-white tracking-wide">
                        Total Weight Per Session
                    </h4>
                </div>
                {barChartData.length > 0 ? (
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height={400} className="min-h-[400px]">
                            <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#94A3B8"
                                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#94A3B8"
                                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        borderRadius: "12px",
                                        backdropFilter: "blur(12px)",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                                    }}
                                    labelStyle={{ color: "#94A3B8", marginBottom: "0.5rem" }}
                                    itemStyle={{ color: "#A78BFA", fontWeight: 600 }}
                                    formatter={(value: number) => [`${value}kg`, 'Total Weight']}
                                    labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#A78BFA" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <Bar
                                    dataKey="totalWeight"
                                    fill="url(#barGradient)"
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[400px] min-h-[400px] bg-white/5 rounded-xl border border-dashed border-white/10">
                        <p className="text-gray-400 text-lg">No data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PRSection;