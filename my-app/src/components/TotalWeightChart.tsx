import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

interface TotalWeightData {
    date: string;
    totalWeight: number;
}

interface TotalWeightChartProps {
    data: TotalWeightData[];
}

const TotalWeightChart: React.FC<TotalWeightChartProps> = ({ data }) => {
    const { elementRef, isVisible } = useRevealOnScroll({ threshold: 0.2 });

    return (
        <div
            ref={elementRef}
            className={`w-full p-6 sm:p-8 rounded-3xl bg-[#1e293b]/50 border border-white/5 backdrop-blur-sm shadow-xl overflow-hidden transition-all duration-1000 ease-out delay-400 ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
        >
            <div className="flex items-center mb-8">
                <div className="w-1.5 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full mr-4 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                <h4 className="text-xl font-bold text-white tracking-wide">
                    Total Volume Per Session
                </h4>
            </div>
            {data.length > 0 ? (
                <div className="w-full">
                    <ResponsiveContainer width="100%" height={400} className="min-h-[400px]">
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#A855F7" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8} />
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
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                formatter={(value: number) => [`${value.toLocaleString()}kg`, 'Total Volume']}
                                labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            />
                            <Bar
                                dataKey="totalWeight"
                                fill="url(#barGradient)"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex items-center justify-center h-[400px] min-h-[400px] bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-gray-400 text-lg">No session data available</p>
                </div>
            )}
        </div>
    );
};

export default TotalWeightChart;
