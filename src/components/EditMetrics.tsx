"use client";

import React, { useState } from "react";
import DividerLine from "./DividerLine";

interface EditMetricsProps {
  weight: number;
  setWeight: (newWeight: number) => void;
  onBackToDashboard: () => void;
}

const EditMetrics: React.FC<EditMetricsProps> = ({
                                                   weight,
                                                   setWeight,
                                                   onBackToDashboard,
                                                 }) => {
  // Personal information states
  const [newWeight, setNewWeight] = useState(weight.toString());
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");

  // Training metrics states
  const [timesPerWeek, setTimesPerWeek] = useState("");
  const [timePerSession, setTimePerSession] = useState("");
  const [repetitionRange, setRepetitionRange] = useState("");

  const handleEdit = () => {
    const updatedWeight = parseFloat(newWeight);
    if (!isNaN(updatedWeight)) {
      setWeight(updatedWeight);
    }
    // If needed, you can later use the other values (height, age, training metrics)
    onBackToDashboard();
  };

  return (
      <div
          className="min-h-screen w-full overflow-y-auto flex flex-col"
          style={{
            background:
                "linear-gradient(to bottom, #09205A 31%, #4E6496 90%, #C2D8FB 100%)",
          }}
      >
        <section className="flex relative justify-center items-center w-full flex-grow max-sm:hidden pt-10">
          <article className="flex relative flex-col items-center p-10 bg-stone-400 bg-opacity-20 rounded-[32px] w-[672px] max-md:m-5 max-md:w-[90%] max-sm:p-5 mb-16">
            <h1 className="mb-5 text-4xl italic font-medium text-center text-white max-sm:text-3xl">
              Edit Metrics
            </h1>
            <DividerLine />

            {/* Personal Information Section */}
            <h2 className="mx-0 my-5 text-3xl text-center text-white max-sm:text-2xl">
              Personal Information
            </h2>
            <div className="flex justify-between mx-0 my-5 w-full max-w-[510px] gap-8 max-md:flex-col max-md:gap-8 max-md:items-center">
              {/* Weight Field */}
              <div className="flex flex-col gap-3 items-center">
                <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="kg"
                    className="rounded border border-gray-300 bg-white px-3 text-center h-[39px] w-[102px] max-sm:w-20 max-sm:h-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Weight"
                />
                <p className="text-base text-center text-white max-sm:text-sm">
                  Weight
                </p>
              </div>
              {/* Height Field */}
              <div className="flex flex-col gap-3 items-center">
                <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="cm"
                    className="rounded border border-gray-300 bg-white px-3 text-center h-[39px] w-[102px] max-sm:w-20 max-sm:h-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Height"
                />
                <p className="text-base text-center text-white max-sm:text-sm">
                  Height
                </p>
              </div>
              {/* Age Field */}
              <div className="flex flex-col gap-3 items-center">
                <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="years"
                    className="rounded border border-gray-300 bg-white px-3 text-center h-[39px] w-[102px] max-sm:w-20 max-sm:h-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Age"
                />
                <p className="text-base text-center text-white max-sm:text-sm">
                  Age
                </p>
              </div>
            </div>

            {/* Training Preferences Section */}
            <h2 className="mx-0 my-5 text-3xl text-center text-white max-sm:text-2xl">
              Training Preferences
            </h2>
            <div className="flex justify-between mx-0 my-5 w-full max-w-[510px] gap-8 max-md:flex-col max-md:gap-8 max-md:items-center">
              {/* Times/Week Field */}
              <div className="flex flex-col gap-3 items-center">
                <input
                    type="text"
                    value={timesPerWeek}
                    onChange={(e) => setTimesPerWeek(e.target.value)}
                    placeholder="times"
                    className="rounded border border-gray-300 bg-white px-3 text-center h-[39px] w-[102px] max-sm:w-20 max-sm:h-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Times/Week"
                />
                <p className="text-base text-center text-white max-sm:text-sm">
                  Times/Week
                </p>
              </div>
              {/* Time/Session Field */}
              <div className="flex flex-col gap-3 items-center">
                <input
                    type="text"
                    value={timePerSession}
                    onChange={(e) => setTimePerSession(e.target.value)}
                    placeholder="minutes"
                    className="rounded border border-gray-300 bg-white px-3 text-center h-[39px] w-[102px] max-sm:w-20 max-sm:h-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Time/Session"
                />
                <p className="text-base text-center text-white max-sm:text-sm">
                  Time/Session
                </p>
              </div>
              {/* Repetition Range Field */}
              <div className="flex flex-col gap-3 items-center">
                <input
                    type="text"
                    value={repetitionRange}
                    onChange={(e) => setRepetitionRange(e.target.value)}
                    placeholder="reps"
                    className="rounded border border-gray-300 bg-white px-3 text-center h-[39px] w-[102px] max-sm:w-20 max-sm:h-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Repetition Range"
                />
                <p className="text-base text-center text-white max-sm:text-sm">
                  Repetition Range
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mt-10 gap-4">
              <button
                  onClick={handleEdit}
                  className="text-xl text-balck bg-blue-800 rounded opacity-100 cursor-pointer h-[39px] w-[102px] flex items-center justify-center hover:opacity-70 transition-opacity"
              >
                Edit
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

        <footer className="w-full bg-black text-white p-4 text-center mt-auto">
          <p className="text-sm">
            © 2025 Fitness Journal | Created by Grancea Alexandru
          </p>
        </footer>
      </div>
  );
};

export default EditMetrics;
