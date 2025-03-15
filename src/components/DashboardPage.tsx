"use client";

import React, { useState } from "react";
import WelcomeHeader from "./WelcomeHeader";
import PersonalRecordsCard from "./PersonalRecordsCard";
import PRSection from "./PRSection";
import TrainingSelector from "./TrainingSelector";

interface TrainingEntry {
  date: string;
  exercises: { [key: string]: number };
}

// Exercise categories data
const exerciseCategories = [
  {
    name: "Chest",
    exercises: ["Dumbbell Press", "Incline Dumbbell", "Dumbbell Flys"],
  },
  {
    name: "Back",
    exercises: ["Pullup", "Dumbbell Row", "Cable Row"],
  },
  {
    name: "Legs",
    exercises: ["Squats", "Leg Curl", "Calf Raises"],
  },
  {
    name: "Arms",
    exercises: ["Biceps Curl", "Cable Triceps Pushdown", "Overhead triceps"],
  },
];

// Generate mock training data
const generateMockTrainings = (): TrainingEntry[] => {
  // Create dates for the last 5 trainings (twice a week)
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (i * 3 + Math.floor(i/2)));  // Simulate Monday/Thursday schedule
    dates.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
  }

  return [
    {
      date: dates[0],
      exercises: {
        "Dumbbell Press": 3,
        "Incline Dumbbell": 25,
        "Dumbbell Flys": 18,
        "Biceps Curl": 30,
        "Cable Triceps Pushdown": 25,
        "Overhead triceps": 15
      }
    },
    // Legs day
    {
      date: dates[1],
      exercises: {
        "Squats": 85,
        "Leg Curl": 60,
        "Calf Raises": 120,
        "Leg Extensions": 55,
        "Leg Press": 140
      }
    },
    // Back day
    {
      date: dates[2],
      exercises: {
        "Pullup": 15, // bodyweight + additional weight
        "Dumbbell Row": 24,
        "Cable Row": 60,
        "Lat Pulldown": 55,
        "Deadlift": 100,
        "Face Pulls": 20
      }
    },
    // Full body day
    {
      date: dates[3],
      exercises: {
        "Squats": 80,
        "Dumbbell Press": 28,
        "Pullup": 12,
        "Biceps Curl": 15,
        "Calf Raises": 110,
        "Cable Triceps Pushdown": 22
      }
    },
    // Heavy compound day
    {
      date: dates[4],
      exercises: {
        "Deadlift": 110,
        "Squats": 90,
        "Dumbbell Press": 32,
        "Dumbbell Row": 26,
        "Overhead Press": 40
      }
    }
  ];
};

const DashboardPage = ({ onLogout, onNavigateToMetricsSection, weight }) => {
  // State to store the list of trainings (in-memory) with mock data
  const [trainings, setTrainings] = useState<TrainingEntry[]>(() => generateMockTrainings());

  // State to toggle between dashboard and TrainingSelector
  const [isAddingTraining, setIsAddingTraining] = useState(false);

  // Function to navigate to TrainingSelector
  const handleNavigateToTrainingSelector = () => {
    setIsAddingTraining(true);
  };

  // Function to save a new training and return to dashboard
  const handleSaveTraining = (newTraining: TrainingEntry) => {
    setTrainings([newTraining, ...trainings]); // Add new training at the beginning
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
                exerciseCategories={exerciseCategories} // Pass exercise categories to the selector
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