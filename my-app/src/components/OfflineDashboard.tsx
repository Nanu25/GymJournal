// OfflineDashboard.tsx
import React from 'react';
import PersonalRecordsCard from './PersonalRecordsCard';
import PRSection from './PRSection';
import WelcomeHeader from './WelcomeHeader';

const OfflineDashboard = ({
                              trainings,
                              onNavigateToTrainingSelector,
                              onNavigateToMetricsSection,
                              handleTrainingsChanged
                          }) => {
    return (
        <main className="relative p-5 w-full max-sm:hidden">
            <div className="bg-yellow-600 text-white p-3 mb-4 rounded-md text-center">
                <h2 className="text-xl font-bold">Offline Mode</h2>
                <p>Your changes will be saved locally and synced when you're back online</p>
            </div>

            <WelcomeHeader username="Offline User" />

            <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-2/3 min-h-[600px]">
                    <PersonalRecordsCard
                        setTrainings={handleTrainingsChanged}
                        onNavigateToMetricsSection={onNavigateToMetricsSection}
                        onNavigateToTrainingSelector={onNavigateToTrainingSelector}
                        onTrainingChange={handleTrainingsChanged}
                    />
                </div>
                <div className="md:w-1/3 flex justify-center">
                    <PRSection trainings={trainings} />
                </div>
            </div>
        </main>
    );
};

export default OfflineDashboard;