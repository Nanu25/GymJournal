import React from 'react';

const TrainingLegend: React.FC = () => {
    return (
        <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mr-2"></div>
                <span className="text-emerald-200">High Volume</span>
            </div>
            <div className="flex items-center">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-2"></div>
                <span className="text-blue-200">Average</span>
            </div>
            <div className="flex items-center">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-red-400 to-red-600 rounded-full mr-2"></div>
                <span className="text-red-200">Light Session</span>
            </div>
        </div>
    );
};

export default TrainingLegend;
