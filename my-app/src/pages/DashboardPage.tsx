import React from 'react';
import PersonalRecordsCard from '../components/PersonalRecordsCard';
import ErrorBoundary from '../components/ErrorBoundary';

const DashboardPage: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <ErrorBoundary>
                <PersonalRecordsCard
                    trainings={[]}
                    setTrainings={() => {}}
                    onNavigateToMetricsSection={() => {}}
                    onNavigateToTrainingSelector={() => {}}
                />
            </ErrorBoundary>
        </div>
    );
};

export default DashboardPage; 