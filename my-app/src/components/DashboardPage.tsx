"use client";

import React, {useEffect, useState } from "react";
import WelcomeHeader from "./WelcomeHeader";
import PersonalRecordsCard from "./PersonalRecordsCard";
import PRSection from "./PRSection";
import TrainingSelector from "./TrainingSelector";

interface TrainingEntry {
  date: string;
  exercises: { [key: string]: number };
}

const DashboardPage = ({ onLogout, onNavigateToMetricsSection}) => {
  const [trainings, setTrainings] = useState<TrainingEntry[]>([]);

  const [isAddingTraining, setIsAddingTraining] = useState(false);

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
            background:
                "linear-gradient(to bottom, #09205A 31%, #4E6496 90%, #C2D8FB 100%)",
          }}
      >
        {isAddingTraining ? (
            <TrainingSelector
                onBackToDashboard={handleBackToDashboard}
                onSaveTraining={handleSaveTraining}
            />
        ) : (
            <main className="relative p-5 w-full max-sm:hidden">
              <WelcomeHeader username="username" />

              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-2/3 min-h-[600px]">
                  <PersonalRecordsCard
                      setTrainings={setTrainings}
                      onNavigateToMetricsSection={onNavigateToMetricsSection}
                      onNavigateToTrainingSelector={handleNavigateToTrainingSelector}
                      onTrainingChange={handleTrainingsChanged}
                  />
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <PRSection
                     trainings={trainings}
                  />
                </div>
              </div>
            </main>
        )}

        <footer className="w-full bg-black text-white p-4 text-center">
          <p className="text-sm">
            © 2025 Fitness Journal | Created by Grancea Alexandru
          </p>
        </footer>
      </div>
  );
};

export default DashboardPage;