"use client";
import React, { useState } from "react";
import CrownIcon from "./icons/CrownIcon";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const BasicPie = () => {
    // Three different datasets
    const datasets = {
        dataset1: [
            { name: "Chest", value: 70 },
            { name: "Back", value: 60 },
            { name: "Legs", value: 50 },
        ],
        dataset2: [
            { name: "Series A", value: 25 },
            { name: "Series B", value: 35 },
            { name: "Series C", value: 10 },
        ],
        dataset3: [
            { name: "Series A", value: 40 },
            { name: "Series B", value: 20 },
            { name: "Series C", value: 15 },
        ]
    };

    // State to track which dataset is currently selected
    const [currentDataset, setCurrentDataset] = useState('dataset1');

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

    // Get the current data based on selected dataset
    const data = datasets[currentDataset];

    return (
        <div className="w-full">
            {/* Dataset selection buttons */}
            <div className="flex justify-center gap-2 mb-2">
                <button
                    className={`px-2 py-1 text-xs rounded ${currentDataset === 'dataset1' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setCurrentDataset('dataset1')}
                >
                    Dataset 1
                </button>
                <button
                    className={`px-2 py-1 text-xs rounded ${currentDataset === 'dataset2' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setCurrentDataset('dataset2')}
                >
                    Dataset 2
                </button>
                <button
                    className={`px-2 py-1 text-xs rounded ${currentDataset === 'dataset3' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setCurrentDataset('dataset3')}
                >
                    Dataset 3
                </button>
            </div>

            {/* Pie chart */}
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name}) => name}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const PRSection = () => {
    return (
        <aside className="mt-48 mx-auto max-md:mt-28">
            <CrownIcon />
            <div className="p-5 opacity-70 bg-red-950 h-auto min-h-[300px] w-[270px]">
                <h3 className="mt-3.5 text-3xl text-center text-white">PR</h3>
                <select className="mx-auto mt-5 mb-0 h-8 text-2xl text-white opacity-50 bg-slate-500 w-[230px]">
                    <option>Select muscle group</option>
                </select>

                 Display the Pie Chart
                <div className="mt-5 flex justify-center">
                    <BasicPie />
                </div>
            </div>
        </aside>
    );
};

export default PRSection;