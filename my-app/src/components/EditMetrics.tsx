"use client";

import React, { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-[#080b14] overflow-x-hidden py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0f172a] rounded-[32px] shadow-[0_0_50px_0_rgba(8,_112,_184,_0.7)] border border-blue-500/10 backdrop-blur-xl p-8">
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-8">
              Edit Metrics
            </h2>

            {/* Personal Information Section */}
            <div className="bg-[#1a2234] rounded-xl border border-blue-500/10 p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Weight */}
                <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                  <label className="block text-blue-200 mb-2">Weight</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="kg"
                    className="w-full px-4 py-2 text-lg border border-blue-500/10 rounded-lg bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    aria-label="Weight"
                  />
                </div>
                {/* Height */}
                <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                  <label className="block text-blue-200 mb-2">Height</label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="cm"
                    className="w-full px-4 py-2 text-lg border border-blue-500/10 rounded-lg bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    aria-label="Height"
                  />
                </div>
                {/* Age */}
                <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                  <label className="block text-blue-200 mb-2">Age</label>
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="years"
                    className="w-full px-4 py-2 text-lg border border-blue-500/10 rounded-lg bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    aria-label="Age"
                  />
                </div>
              </div>
            </div>

            {/* Training Preferences Section */}
            <div className="bg-[#1a2234] rounded-xl border border-blue-500/10 p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Training Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Times/Week */}
                <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                  <label className="block text-blue-200 mb-2">Times/Week</label>
                  <input
                    type="text"
                    value={timesPerWeek}
                    onChange={(e) => setTimesPerWeek(e.target.value)}
                    placeholder="times"
                    className="w-full px-4 py-2 text-lg border border-blue-500/10 rounded-lg bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    aria-label="Times/Week"
                  />
                </div>
                {/* Time/Session */}
                <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                  <label className="block text-blue-200 mb-2">Time/Session</label>
                  <input
                    type="text"
                    value={timePerSession}
                    onChange={(e) => setTimePerSession(e.target.value)}
                    placeholder="minutes"
                    className="w-full px-4 py-2 text-lg border border-blue-500/10 rounded-lg bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    aria-label="Time/Session"
                  />
                </div>
                {/* Repetition Range */}
                <div className="bg-[#0f172a] p-4 rounded-xl border border-blue-500/10">
                  <label className="block text-blue-200 mb-2">Repetition Range</label>
                  <input
                    type="text"
                    value={repetitionRange}
                    onChange={(e) => setRepetitionRange(e.target.value)}
                    placeholder="reps"
                    className="w-full px-4 py-2 text-lg border border-blue-500/10 rounded-lg bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                    aria-label="Repetition Range"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleEdit}
                className="flex-1 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-400 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:border-blue-300"
              >
                Save Changes
              </button>
              <button
                onClick={onBackToDashboard}
                className="flex-1 py-4 text-xl font-bold text-blue-200 bg-[#1a2234] rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMetrics;