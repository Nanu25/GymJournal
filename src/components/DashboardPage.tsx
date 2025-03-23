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
  const dates = ["2025-01-10", "2025-01-20", "2025-01-25", "2025-02-07", "2025-02-09", "2025-02-10", "2025-02-14", "2025-02-26"];
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
    },
    //Chest
    {
      date: dates[5],
        exercises: {
            "Dumbbell Press": 35,
            "Incline Dumbbell": 30,
            "Dumbbell Flys": 20,
            "Chest Press": 60,
            "Push-ups": 25
        }
    },

    {
        date: dates[6],
        exercises: {
          "Dumbbell Press": 40,
          "Incline Dumbbell": 35,
          "Dumbbell Flys": 25,
          "Biceps Curl": 35,
        }

    },

    {
      date: dates[7],
        exercises: {
            "Dumbbell Press": 45,
            "Incline Dumbbell": 40,
            "Dumbbell Flys": 30,
            "Chest Press": 70,
            "Push-ups": 30,
            "Biceps Curl": 40,
            "Triceps Pushdown": 30,
        }
    }

  ];
};

const DashboardPage = ({ onLogout, onNavigateToMetricsSection, weight }) => {
  const [trainings, setTrainings] = useState<TrainingEntry[]>(() => generateMockTrainings());

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
                      trainings={trainings}
                      setTrainings={setTrainings}
                      onNavigateToMetricsSection={onNavigateToMetricsSection}
                      onNavigateToTrainingSelector={handleNavigateToTrainingSelector}
                      weight={weight}
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