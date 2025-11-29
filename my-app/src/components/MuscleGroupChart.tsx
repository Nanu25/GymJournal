import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";


interface PieChartData {
    name: string;
    value: number;
}

interface MuscleGroupChartProps {
    data: PieChartData[];
}

const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#F472B6", "#22D3EE", "#FB923C", "#C084FC", "#C026D3"];

const MuscleGroupChart: React.FC<MuscleGroupChartProps> = ({ data }) => {
    return (
        <div
            className="w-full p-6 sm:p-8 rounded-3xl bg-[#1e293b]/50 border border-white/5 backdrop-blur-sm shadow-xl flex flex-col h-full"
        >
            <div className="flex items-center mb-4 sm:mb-8">
                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                <h4 className="text-xl font-bold text-white tracking-wide">
                    Muscle Group Distribution
                </h4>
            </div>
            {data.length > 0 ? (
                <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px]">
                    <div className="w-full h-[250px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="40%"
                                    outerRadius="70%"
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={8}
                                >
                                    {data.map((_, index) => (
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
                                            const entry = payload[0];
                                            return (
                                                <div className="bg-[#0f172a]/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl">
                                                    <p className="text-white font-bold text-lg mb-1">{entry.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.payload.fill }}></div>
                                                        <p className="text-gray-300">
                                                            {entry.value} exercises
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
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4 w-full">
                        {data.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-sm text-gray-300 whitespace-nowrap">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-[300px] bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-gray-400 text-lg">No data available</p>
                </div>
            )}
        </div>
    );
};

export default MuscleGroupChart;
