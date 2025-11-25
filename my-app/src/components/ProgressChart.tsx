import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Area,
    ResponsiveContainer,
} from "recharts";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

interface LineChartData {
    date: string;
    weight: number;
}

interface ProgressChartProps {
    data: LineChartData[];
    selectedExercise: string | null;
    exerciseList: string[];
    onExerciseChange: (exercise: string) => void;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
    data,
    selectedExercise,
    exerciseList,
    onExerciseChange
}) => {
    const { elementRef, isVisible } = useRevealOnScroll({ threshold: 0.2 });

    return (
        <div
            ref={elementRef}
            className={`w-full p-6 sm:p-8 rounded-3xl bg-[#1e293b]/50 border border-white/5 backdrop-blur-sm shadow-xl overflow-hidden transition-all duration-1000 ease-out delay-200 ${isVisible
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
                        onChange={(e) => onExerciseChange(e.target.value)}
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

            {data.length > 0 ? (
                <div className="w-full">
                    <ResponsiveContainer width="100%" height={400} className="min-h-[400px]">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
    );
};

export default ProgressChart;
