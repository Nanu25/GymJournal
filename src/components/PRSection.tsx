"use client";
import React, { useState, useEffect, useMemo } from "react";
import CrownIcon from "./icons/CrownIcon";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
} from "recharts";

const muscleGroupMapping = {
    "Bench Press": "Chest",
    "Dumbbell Press": "Chest",
    "Dumbbell Flys": "Chest",
    "Incline Dumbbell": "Chest",
    "Chest Press": "Chest",
    "Deadlift": "Back",
    "Lat Pulldown": "Back",
    "Pullup": "Back",
    "Dumbbell Row": "Back",
    "Cable Row": "Back",
    "Dumbbell Row": "Back",
    "Back Extensions": "Back",
    "Shoulder Press": "Shoulders",
    "Lateral Raise": "Shoulders",
    "Front Raise": "Shoulders",
    "Shrugs": "Shoulders",
    "Face Pulls": "Shoulders",
    "Squat": "Legs",
    "Leg Press": "Legs",
    "Leg Curl": "Legs",
    "Calf Raise": "Legs",
    "Lunges": "Legs",
    "Cable Triceps Pushdown": "Arms",
    "Hammer Curls": "Arms",
    "Dips": "Arms",
    "Biceps Curl": "Arms",
    "Overhead Triceps": "Arms"
};

// Colors for the pie chart segments
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const PRSection = ({trainings = []}) => {
    const [pieChartData, setPieChartData] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [lineChartData, setLineChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add this line

    // const [trainings, setTrainings] = useState([]);
    // useEffect(() => {
    //     const fetchTrainings = async () => {
    //         try {
    //             const response = await fetch("/api/trainings");
    //             if (!response.ok) throw new Error("Failed to fetch trainings");
    //             const data = await response.json();
    //             setTrainings(data);
    //         } catch (error) {
    //             console.error("Error fetching trainings:", error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchTrainings();
    // }, []);

    // Fetch pie chart data (Muscle Group Distribution)
    useEffect(() => {
        const fetchMuscleGroupData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 100));

                const response = await fetch('/api/trainings/muscle-group-distribution');

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                setPieChartData(data);
            } catch (error) {
                console.error('Error fetching muscle group distribution:', error);
            }
        };

        fetchMuscleGroupData();
    }, [trainings]); // Only fetch once on component mount or add dependencies if needed

// Update the useEffect in your PRSection.tsx
    useEffect(() => {
        if (selectedExercise) {
            // Show loading state if needed
            setIsLoading(true);

            // Fetch data from the backend
            fetch(`/api/trainings/exercise-progress/${encodeURIComponent(selectedExercise)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch exercise progress data');
                    }
                    return response.json();
                })
                .then(data => {
                    setLineChartData(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching exercise progress:', error);
                    setLineChartData([]);
                    setIsLoading(false);
                });
        } else {
            setLineChartData([]);
        }
    }, [selectedExercise]);
    // Compute bar chart data (Total Weight Per Session)
    useEffect(() => {
        const timer = setTimeout(() => {
            const data = trainings
                .map((training) => ({
                    date: training.date,
                    totalWeight: Object.values(training.exercises).reduce(
                        (sum, weight) => sum + weight,
                        0
                    ),
                }))
                .sort((a, b) => a.date.localeCompare(b.date));
            setBarChartData(data);
        }, 100); // Simulate async delay
        return () => clearTimeout(timer);
    }, [trainings]);

    // Get unique exercises for the dropdown
    const exerciseList = useMemo(() => {
        const allExercises = new Set();
        trainings.forEach((training) => {
            Object.keys(training.exercises).forEach((exercise) =>
                allExercises.add(exercise)
            );
        });
        return Array.from(allExercises);
    }, [trainings]);

    return (
        <aside className="mt-60 mx-auto max-md:mt-40 flex flex-col items-center">
            <CrownIcon />
            <div className="p-5 opacity-70 bg-red-950 h-auto min-h-[370px] w-[420px]">
                {/* Pie Chart: Muscle Group Distribution */}
                <div className="mb-5">
                    <h4 className="text-white text-center">Muscle Group Distribution</h4>
                    {pieChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={75}
                                    fill="#8884d8"
                                    dataKey="value"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-white text-center">No data available</p>
                    )}
                </div>

                {/* Line Chart: Progress Over Time */}
                <div className="mb-5">
                    <h4 className="text-white text-center">Progress Over Time</h4>
                    <select
                        className="block mx-auto mt-2 mb-2 h-8 text-sm text-white bg-slate-500 w-64 flex justify-center"
                        value={selectedExercise || ""}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                    >
                        <option value="">Select an exercise</option>
                        {exerciseList.map((exercise) => (
                            <option key={exercise} value={exercise}>
                                {exercise}
                            </option>
                        ))}
                    </select>
                    {lineChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={150}>
                            <LineChart data={lineChartData}>
                                <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-white text-center">No data for selected exercise</p>
                    )}
                </div>

                {/* Bar Chart: Total Weight Per Session */}
                <div className="mb-5">
                    <h4 className="text-white text-center">Total Weight Per Session</h4>
                    {barChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={barChartData}>
                                <Bar dataKey="totalWeight" fill="#8884d8" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-white text-center">No data available</p>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default PRSection;