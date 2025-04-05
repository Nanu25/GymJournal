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

// Colors for the pie chart segments
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#00308F"];

const PRSection = ({trainings = []}) => {
    const [pieChartData, setPieChartData] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [lineChartData, setLineChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add this line

    useEffect(() => {
        const fetchMuscleGroupData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 100));

                const response = await fetch('http://localhost:3000/api/trainings/muscle-group-distribution');

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
    }, [trainings]);

    useEffect(() => {
        if (selectedExercise) {
            setIsLoading(true);

            fetch(`http://localhost:3000/api/trainings/exercise-progress/${encodeURIComponent(selectedExercise)}`)
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

    useEffect(() => {
        const fetchTotalWeightData = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/trainings/total-weight");
                if (!response.ok) throw new Error("Failed to fetch total weight data");
                const data = await response.json();
                setBarChartData(data);
            } catch (error) {
                console.error("Error fetching total weight data:", error);
            }
        };

        fetchTotalWeightData();
    }, [trainings]); // Add trainings as dependency to re-fetch when data changes

// Update the exercise list with backend data
    useEffect(() => {
        const fetchExerciseList = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/trainings/exercises");
                if (!response.ok) throw new Error("Failed to fetch exercise list");
                const data = await response.json();
                setExerciseList(data);
            } catch (error) {
                console.error("Error fetching exercise list:", error);
            }
        };

        fetchExerciseList();
    }, [trainings]); // Add trainings as dependency

    const [exerciseList, setExerciseList] = useState([]);

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