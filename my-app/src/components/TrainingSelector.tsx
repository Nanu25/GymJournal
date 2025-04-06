"use client";

import React, { useState } from "react";
import DividerLine from "./DividerLine";
import MetricInput from "./MetricInput";

const TrainingSelector = ({ onBackToDashboard }) => {
  const [trainingData, setTrainingData] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [activeCategory, setActiveCategory] = useState("Chest");

  const exerciseCategories = [
    {
      name: "Chest",
      exercises: ["Dumbbell Press", "Incline Dumbbell", "Dumbbell Flys", "Chest Press", "Push-ups"],
    },
    {
      name: "Back",
      exercises: ["Pullup", "Dumbbell Row", "Cable Row", "Lat Pulldown", "Deadlift", "Back Extensions"],
    },
    {
      name: "Legs",
      exercises: ["Squats", "Leg Curl", "Calf Raises", "Leg Press", "Lunges"],
    },
    {
      name: "Arms",
      exercises: ["Biceps Curl", "Cable Triceps Pushdown", "Overhead Triceps", "Hammer Curls", "Dips"],
    },
    {
      name: "Shoulders",
      exercises: ["Shoulder Press", "Lateral Raises", "Front Raises", "Shrugs", "Face Pulls"],
    },
  ];

  const handleExerciseChange = (exercise, value) => {
    setTrainingData((prev) => ({
      ...prev,
      [exercise]: value,
    }));
  };

  const handleSaveTraining = async () => {
    const filteredData = Object.entries(trainingData)
        .filter(([_, value]) => value > 0)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

    if (Object.keys(filteredData).length > 0) {
      const trainingEntry = {
        date,
        exercises: filteredData,
      };

      try {
        const response = await fetch("/api/trainings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trainingEntry),
        });

        if (!response.ok) {
          throw new Error("Failed to save training");
        }

        const savedTraining = await response.json();
        console.log("Training saved:", savedTraining);

        // Reset form
        setTrainingData({});
        setDate(new Date().toISOString().split("T")[0]);
        onBackToDashboard(); // Navigate back after saving
      } catch (error) {
        console.error("Error saving training:", error);
        alert("Failed to save training. Please try again.");
      }
    }
  };

  const exercisesAdded = Object.values(trainingData).filter((val) => val > 0).length;

  return (
      <div
          className="min-h-screen w-full overflow-y-auto flex flex-col"
          style={{
            background: "linear-gradient(to bottom, #09205A 31%, #4E6496 90%, #C2D8FB 100%)",
          }}
      >
        <section className="flex relative justify-center items-center w-full flex-grow py-10">
          <article className="flex flex-col items-center p-8 bg-stone-400 bg-opacity-80 rounded-3xl w-[700px] max-md:m-5 max-md:w-[90%] shadow-xl">
            <h1 className="mb-5 text-4xl font-bold text-center text-white">
              Add Training Session
            </h1>

            <DividerLine />

            <div className="w-full max-w-[600px] mt-6 mb-5">
              <div className="flex items-center mb-6">
                <div className="flex-1">
                  <label className="text-white text-lg block mb-2 font-medium">Training Date</label>
                  <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-white bg-opacity-10 border border-gray-300 rounded-lg p-3 text-black w-full focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ borderColor: "#B4A0A0", boxShadow: "0 0 0 1px rgba(180, 160, 160, 0.2)" }}
                  />
                </div>
                <div className="ml-4 rounded-lg p-4 text-white text-center shadow-lg" style={{ backgroundColor: "#2ac744" }}>
                  <p className="text-sm uppercase font-semibold">Exercises Added</p>
                  <p className="text-3xl font-bold">{exercisesAdded}</p>
                </div>
              </div>
            </div>

            {/* Exercise Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 w-full max-w-[600px]">
              {exerciseCategories.map((category) => (
                  <button
                      key={category.name}
                      onClick={() => setActiveCategory(category.name)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          activeCategory === category.name
                              ? "text-white bg-gray-800"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                      style={activeCategory === category.name ? { backgroundColor: "#000005" } : {}}
                  >
                    {category.name}
                  </button>
              ))}
            </div>

            {/* Exercise Inputs */}
            <div className="bg-stone-500 bg-opacity-70 rounded-xl p-6 w-full max-w-[600px] mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">{activeCategory} Exercises</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exerciseCategories
                  .find((cat) => cat.name === activeCategory)
                  ?.exercises.map((exercise) => (
                      <div key={exercise} className="bg-stone-500 p-4 rounded-lg">
                        <MetricInput
                            label={exercise}
                            onChange={handleExerciseChange}
                            value={trainingData[exercise] || ""}
                        />
                      </div>
                  ))}
            </div>
          </div>


            <div className="flex justify-center mt-6 gap-4">
              <button
                  onClick={onBackToDashboard}
                  className="text-xl font-medium text-black bg-gray-700 rounded-lg opacity-100 cursor-pointer py-3 px-6 flex items-center justify-center hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                  onClick={handleSaveTraining}
                  className="text-xl font-medium text-white rounded-lg opacity-100 cursor-pointer py-3 px-6 flex items-center justify-center hover:opacity-90 transition-all"
                  style={{ backgroundColor: "#000005" }}
              >
                Save Training
              </button>
            </div>
          </article>
        </section>
      </div>
  );
};

export default TrainingSelector;