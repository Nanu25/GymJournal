import React, { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConsistencyHeatmapProps {
    dates: string[]; // Array of date strings "YYYY-MM-DD"
}

const TrainingHeatmap: React.FC<ConsistencyHeatmapProps> = ({ dates }) => {
    // Generate data for the last 365 days
    const heatmapData = useMemo(() => {
        const today = new Date();
        const data: { date: string; count: number; dayOfWeek: number }[] = [];
        const dateSet = new Set(dates);

        // Iterate backwards from today for 52 weeks * 7 days
        for (let i = 0; i < 364; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - (363 - i)); // Start from ~1 year ago
            const dateStr = date.toISOString().split('T')[0];

            data.push({
                date: dateStr,
                count: dateSet.has(dateStr) ? 1 : 0,
                dayOfWeek: date.getDay(),
            });
        }
        return data;
    }, [dates]);

    // Group by weeks for the grid
    const weeks = useMemo(() => {
        const weeksArray: { date: string; count: number; dayOfWeek: number }[][] = [];
        let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];

        heatmapData.forEach((day, index) => {
            currentWeek.push(day);
            if (currentWeek.length === 7 || index === heatmapData.length - 1) {
                weeksArray.push(currentWeek);
                currentWeek = [];
            }
        });
        return weeksArray;
    }, [heatmapData]);

    const getIntensityClass = (count: number) => {
        if (count === 0) return "bg-[#1e293b]";
        return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
    };

    return (
        <div className="w-full bg-[#0f172a]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Training Consistency</h3>
                    <p className="text-sm text-slate-400">
                        {dates.length} sessions in the last 12 months
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Less</span>
                    <div className="w-3 h-3 bg-[#1e293b] rounded-sm"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                    <span>More</span>
                </div>
            </div>

            <div className="w-full overflow-x-auto pb-2">
                <div className="flex gap-1 w-full h-full min-w-[700px]">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1 flex-1">
                            {week.map((day, dayIndex) => (
                                <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div
                                                className={`w-full aspect-square rounded-sm transition-all duration-200 hover:scale-125 ${getIntensityClass(day.count)}`}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-slate-900 border border-white/10 text-xs">
                                            <p className="font-medium text-white">{day.date}</p>
                                            <p className="text-slate-400">{day.count > 0 ? 'Training completed' : 'No training'}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainingHeatmap;
