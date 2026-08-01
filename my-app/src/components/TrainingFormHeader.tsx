import React from 'react';

interface TrainingFormHeaderProps {
    date: string;
    setDate: (date: string) => void;
    exercisesAdded: number;
}

const TrainingFormHeader: React.FC<TrainingFormHeaderProps> = ({ date, setDate, exercisesAdded }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
                <label className="block text-blue-200 mb-2 text-lg">
                    Training Date
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-6 py-4 text-lg border border-blue-500/10 rounded-xl bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                />
            </div>
            <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-500/30 p-4 text-center">
                <p className="text-emerald-200 text-sm font-medium">Exercises Added</p>
                <p className="text-3xl font-bold text-white mt-1">{exercisesAdded}</p>
            </div>
        </div>
    );
};

export default TrainingFormHeader;
