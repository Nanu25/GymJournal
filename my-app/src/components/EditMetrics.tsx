"use client";

import React, { useState, useEffect } from "react";
import DividerLine from "./DividerLine";

interface EditMetricsProps {
  onBackToDashboard: () => void;
}

const EditMetrics: React.FC<EditMetricsProps> = ({ onBackToDashboard }) => {
  // Personal information states
  const [newWeight, setNewWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");

  // Training metrics states
  const [timesPerWeek, setTimesPerWeek] = useState("");
  const [timePerSession, setTimePerSession] = useState("");
  const [repetitionRange, setRepetitionRange] = useState("");

  // Fetch initial metrics from backend on mount
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setNewWeight(data.weight?.toString() || '');
        setHeight(data.height?.toString() || '');
        setAge(data.age?.toString() || '');
        setTimesPerWeek(data.timesPerWeek?.toString() || '');
        setTimePerSession(data.timePerSession?.toString() || '');
        setRepetitionRange(data.repRange || '');
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };
    fetchMetrics();
  }, []);

  // Handle edit by sending updated metrics to backend
  const handleEdit = async () => {
    const weightNum = parseFloat(newWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      alert('Please enter a valid positive weight');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          weight: weightNum,
          height: parseFloat(height) || undefined,
          age: parseInt(age) || undefined,
          timesPerWeek: parseInt(timesPerWeek) || undefined,
          timePerSession: parseInt(timePerSession) || undefined,
          repRange: repetitionRange || undefined
        }),
      });
      if (!response.ok) throw new Error('Failed to update metrics');
      const updatedData = await response.json();
      console.log('Updated metrics:', updatedData);
      onBackToDashboard();
    } catch (error) {
      console.error('Error updating metrics:', error);
      alert('Failed to update metrics');
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background:
          "linear-gradient(to bottom, #09205A 31%, #4E6496 90%, #C2D8FB 100%)",
      }}
    >
      <section className="flex flex-col items-center justify-center flex-grow py-6 px-2">
        <article className="w-full max-w-md bg-stone-400 bg-opacity-20 rounded-2xl p-4 sm:p-8 mb-8">
          <h1 className="mb-5 text-2xl sm:text-3xl md:text-4xl italic font-medium text-center text-white">
            Edit Metrics
          </h1>
          <DividerLine />

          {/* Personal Information Section */}
          <h2 className="my-4 text-xl sm:text-2xl text-center text-white">
            Personal Information
          </h2>
          <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
            {/* Weight */}
            <div className="flex flex-col items-center flex-1">
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="kg"
                className="rounded border border-gray-300 bg-white px-3 py-2 text-center w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Weight"
              />
              <p className="text-base text-white mt-1">Weight</p>
            </div>
            {/* Height */}
            <div className="flex flex-col items-center flex-1">
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="cm"
                className="rounded border border-gray-300 bg-white px-3 py-2 text-center w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Height"
              />
              <p className="text-base text-white mt-1">Height</p>
            </div>
            {/* Age */}
            <div className="flex flex-col items-center flex-1">
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="years"
                className="rounded border border-gray-300 bg-white px-3 py-2 text-center w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Age"
              />
              <p className="text-base text-white mt-1">Age</p>
            </div>
          </div>

          {/* Training Preferences Section */}
          <h2 className="my-4 text-xl sm:text-2xl text-center text-white">
            Training Preferences
          </h2>
          <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
            {/* Times/Week */}
            <div className="flex flex-col items-center flex-1">
              <input
                type="text"
                value={timesPerWeek}
                onChange={(e) => setTimesPerWeek(e.target.value)}
                placeholder="times"
                className="rounded border border-gray-300 bg-white px-3 py-2 text-center w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Times/Week"
              />
              <p className="text-base text-white mt-1">Times/Week</p>
            </div>
            {/* Time/Session */}
            <div className="flex flex-col items-center flex-1">
              <input
                type="text"
                value={timePerSession}
                onChange={(e) => setTimePerSession(e.target.value)}
                placeholder="minutes"
                className="rounded border border-gray-300 bg-white px-3 py-2 text-center w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Time/Session"
              />
              <p className="text-base text-white mt-1">Time/Session</p>
            </div>
            {/* Repetition Range */}
            <div className="flex flex-col items-center flex-1">
              <input
                type="text"
                value={repetitionRange}
                onChange={(e) => setRepetitionRange(e.target.value)}
                placeholder="reps"
                className="rounded border border-gray-300 bg-white px-3 py-2 text-center w-full max-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Repetition Range"
              />
              <p className="text-base text-white mt-1">Repetition Range</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center mt-8 gap-2 sm:gap-4">
            <button
              onClick={handleEdit}
              className="w-full sm:w-auto text-base sm:text-xl text-black bg-blue-800 rounded opacity-100 cursor-pointer px-4 py-2 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              Edit
            </button>
            <button
              onClick={onBackToDashboard}
              className="w-full sm:w-auto text-base sm:text-xl text-black bg-blue-800 rounded opacity-100 cursor-pointer px-4 py-2 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              Go Back
            </button>
          </div>
        </article>
      </section>
      <footer className="w-full bg-black text-white p-4 text-center mt-auto">
        <p className="text-xs sm:text-sm">
          © 2025 Fitness Journal | Created by Grancea Alexandru
        </p>
      </footer>
    </div>
  );
};

export default EditMetrics;