"use client";

import React, { useState } from "react";
import WelcomeHeader from "./WelcomeHeader";
import PersonalRecordsCard from "./PersonalRecordsCard";
import PRSection from "./PRSection";
import TrainingSelector from "./TrainingSelector";

// Define the shape of a training entry from TrainingSelector
interface TrainingEntry {
  date: string;
  exercises: { [key: string]: number };
}

const DashboardPage = ({ onLogout, onNavigateToMetricsSection, weight }) => {
  // State to store the list of trainings (in-memory)
  const [trainings, setTrainings] = useState<TrainingEntry[]>([]);

  // State to toggle between dashboard and TrainingSelector
  const [isAddingTraining, setIsAddingTraining] = useState(false);

  // Function to navigate to TrainingSelector
  const handleNavigateToTrainingSelector = () => {
    setIsAddingTraining(true);
  };

  // Function to save a new training and return to dashboard
  const handleSaveTraining = (newTraining: TrainingEntry) => {
    setTrainings([...trainings, newTraining]);
    setIsAddingTraining(false);
  };

  // Function to go back to dashboard without saving
  const handleBackToDashboard = () => {
    setIsAddingTraining(false);
  };

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
                <div className="md:w-2/3">
                  <PersonalRecordsCard
                      trainings={trainings}
                      setTrainings={setTrainings}
                      onNavigateToMetricsSection={onNavigateToMetricsSection}
                      onNavigateToTrainingSelector={handleNavigateToTrainingSelector}
                      weight={weight}
                  />
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <PRSection />
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