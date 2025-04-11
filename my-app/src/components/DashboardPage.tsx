"use client";

import React, {useEffect, useState } from "react";
import WelcomeHeader from "./WelcomeHeader";
import PersonalRecordsCard from "./PersonalRecordsCard";
import PRSection from "./PRSection";
import TrainingSelector from "./TrainingSelector";
import CrownIcon from "./icons/CrownIcon";

interface TrainingEntry {
  date: string;
  exercises: { [key: string]: number };
}

interface DashboardPageProps {
    onLogout: () => void;
    onNavigateToMetricsSection: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, onNavigateToMetricsSection }) => {
  const [trainings, setTrainings] = useState<TrainingEntry[]>([]);
  const [isAddingTraining, setIsAddingTraining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigateToTrainingSelector = () => {
    setIsAddingTraining(true);
  };

  const handleSaveTraining = (newTraining: TrainingEntry) => {
    setTrainings([newTraining, ...trainings]);
    setIsAddingTraining(false);
  };

  const handleBackToDashboard = () => {
    setIsAddingTraining(false);
  };

  const handleTrainingsChanged = (updatedTrainings: TrainingEntry[]) => {
    setTrainings(updatedTrainings);
  };

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await fetch("/api/trainings");
        if (!response.ok) throw new Error("Failed to fetch trainings");
        const data = await response.json();
        setTrainings(data);
      } catch (error) {
        console.error("Error fetching trainings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  return (
      <div
          className="min-h-screen w-full overflow-y-auto"
          style={{
            background: "linear-gradient(180deg, #09205A 0%, #1E3A8A 50%, #2563EB 100%)",
            backgroundAttachment: "fixed"
          }}
      >
        {isAddingTraining ? (
            <TrainingSelector
                onBackToDashboard={handleBackToDashboard}
                onSaveTraining={handleSaveTraining}
            />
        ) : (
            <>
                <main className="container mx-auto px-6 py-8 max-w-[1920px]">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-12">
                        <WelcomeHeader username="username" />
                    </div>

                    {/* Main Content Section with 60/40 split */}
                    <div className="flex gap-8">
                        {/* Left Section - PersonalRecordsCard (60%) */}
                        <div className="flex-[6]">
                            <PersonalRecordsCard
                                trainings={trainings}
                                setTrainings={setTrainings}
                                onNavigateToMetricsSection={onNavigateToMetricsSection}
                                onNavigateToTrainingSelector={handleNavigateToTrainingSelector}
                                onTrainingChange={handleTrainingsChanged}
                            />
                        </div>

                        {/* Right Section - PRSection (40%) */}
                        <div className="flex-[4] relative">
                            {/* <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                                <CrownIcon />
                            </div> */}
                            <PRSection
                                trainings={trainings}
                            />
                        </div>
                    </div>
                </main>
                <footer className="w-full bg-[#0f172a] text-white p-6 mt-12">
                  <div className="container mx-auto text-center">
                      <p className="text-sm font-medium">
                          © 2025 Fitness Journal | Created by Grancea Alexandru
                      </p>
                  </div>
              </footer>

                          </>
        )}
      </div>
  );
};

export default DashboardPage;