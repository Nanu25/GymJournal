import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface MuscleBalanceRadarProps {
    data: { name: string; value: number }[];
}

const MuscleBalanceRadar: React.FC<MuscleBalanceRadarProps> = ({ data }) => {
    // Normalize data for better visualization if needed, or use raw values
    // For now, we use raw values but ensure we have at least 3 points for a polygon
    const chartData = data.length < 3
        ? [...data, { name: 'Placeholder', value: 0 }, { name: 'Placeholder 2', value: 0 }]
        : data;

    return (
        <div className="w-full bg-[#0f172a]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col h-full min-h-[350px] sm:min-h-[450px]">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1">Muscle Balance</h3>
                <p className="text-sm text-slate-400">Distribution of training volume</p>
            </div>

            <div className="flex-1 w-full min-h-0 h-[300px] sm:h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis
                            dataKey="name"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Radar
                            name="Volume"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="#3b82f6"
                            fillOpacity={0.3}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#60a5fa' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MuscleBalanceRadar;
