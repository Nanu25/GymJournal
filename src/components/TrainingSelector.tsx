"use client";

import React, { useState } from "react";
import DividerLine from "./DividerLine";
import MetricInput from "./MetricInput";

const TrainingSelector = ({ onBackToDashboard, onSaveTraining }) => {
  const [trainingData, setTrainingData] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

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

  const handleExerciseChange = (exercise, value) => {
    setTrainingData((prev) => ({
      ...prev,
      [exercise]: value,
    }));
  };

  const handleSaveTraining = () => {
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
      onSaveTraining(trainingEntry);
      setTrainingData({});
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  return (
      <div
          className="min-h-screen w-full overflow-y-auto flex flex-col"
          style={{
            background:
                "linear-gradient(to bottom, #09205A 31%, #4E6496 90%, #C2D8FB 100%)",
          }}
      >
        <section className="flex relative justify-center items-center w-full flex-grow pt-10">
          <article className="flex flex-col items-center p-10 bg-stone-400 bg-opacity-20 rounded-[32px] w-[672px] max-md:m-5 max-md:w-[90%]">
            <h1 className="mb-5 text-4xl italic font-medium text-center text-white">
              Add Training
            </h1>
            <DividerLine />
            <div className="w-full max-w-[510px] mt-5 mb-5">
              <label className="text-white block mb-2">Training Date</label>
              <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-white bg-opacity-20 border border-gray-300 rounded p-2 text-white w-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-6 w-full max-w-[510px]">
              {exerciseCategories.flatMap((category) =>
                  category.exercises.map((exercise) => (
                      <MetricInput
                          key={exercise}
                          label={exercise}
                          onChange={handleExerciseChange}
                      />
                  ))
              )}
            </div>
            <div className="flex justify-center mt-10 gap-4">
              <button
                  onClick={handleSaveTraining}
                  className="text-xl text-black bg-blue-800 rounded opacity-100 cursor-pointer h-[39px] w-[102px] flex items-center justify-center hover:opacity-70 transition-opacity"
              >
                Add
              </button>
              <button
                  onClick={onBackToDashboard}
                  className="text-xl text-black bg-blue-800 rounded opacity-100 cursor-pointer h-[39px] w-[102px] flex items-center justify-center hover:opacity-70 transition-opacity"
              >
                Go Back
              </button>
            </div>
          </article>
        </section>
      </div>
  );
};

export default TrainingSelector;