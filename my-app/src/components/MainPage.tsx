import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MainPageProps {
    onLogout: () => void;
}

const MainPage = ({ onLogout }: MainPageProps) => {
    const [weight, setWeight] = useState(70);
    const [isEditing, setIsEditing] = useState(false);
    const [newWeight, setNewWeight] = useState("");
    const [message, setMessage] = useState("");

    const handleUpdateWeight = async () => {
        try {
            const response = await fetch("/api/updateWeight", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weight: parseFloat(newWeight) }),
            });
            const data = await response.json();
            if (response.ok) {
                setWeight(data.weight);
                setIsEditing(false);
                setMessage("");
            } else {
                setMessage(data.error || "Failed to update weight");
            }
        } catch (error) {
            setMessage("Server error");
        }
    };

    return (
        <div
            className="flex flex-col min-h-screen w-full"
            style={{
                background: "linear-gradient(to bottom, #09205A 0%, #4E6496 31%, #C2D8FB 100%)",
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-6 bg-white/10 backdrop-blur-sm shadow-sm">
                <h1
                    className="text-4xl font-bold text-white"
                    style={{ fontFamily: "Pacifico, cursive" }}
                >
                    Welcome back username
                </h1>
                <div className="w-12 h-12">
                    {/* Barbell Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black">
                        <path d="M21 12h-1V7h-2v5h-1V7h-2v5h-1V7h-2v5H9V7H7v5H6V7H4v5H3v2h1v5h2v-5h1v5h2v-5h1v5h2v-5h1v5h2v-5h1v-2z" />
                    </svg>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar (empty) */}
                <div className="w-1/4 p-6"></div>

                {/* Center: Records Section */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="rounded-lg border border-blue-500 bg-blue-100 p-4">
                        <CardHeader>
                            <CardTitle>Your personal records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-4">
                                {/* Current Weight */}
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-lg font-semibold">
                                        Current weight: {weight} kg
                                    </p>
                                    <button className="text-gray-500 hover:text-gray-700">
                                        X
                                    </button>
                                </div>
                                {/* Training Sessions */}
                                {[
                                    {
                                        id: 1,
                                        duration: "30 min",
                                        calories: "200",
                                        muscle: "Chest",
                                        pr: "Yes",
                                    },
                                    {
                                        id: 2,
                                        duration: "45 min",
                                        calories: "300",
                                        muscle: "Back",
                                        pr: "No",
                                    },
                                    {
                                        id: 3,
                                        duration: "60 min",
                                        calories: "400",
                                        muscle: "Legs",
                                        pr: "Yes",
                                    },
                                ].map((session) => (
                                    <div key={session.id} className="mt-2 p-2 bg-white rounded shadow">
                                        <p>Duration: {session.duration}</p>
                                        <p>Calories: {session.calories}</p>
                                        <p>Muscle group: {session.muscle}</p>
                                        <p>PR: {session.pr}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Action Buttons */}
                            <div className="mt-4 flex justify-between">
                                <button className="flex items-center gap-2 bg-gray-200 rounded-full px-4 py-2 hover:bg-gray-300">
                                    <span className="text-black">
                                        Add training session
                                    </span>
                                    {/* Person Exercising Icon */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="black"
                                    >
                                        <path d="M12 2a10 10 0 00-10 10 10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm0 18a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                    </svg>
                                </button>
                                {/* Edit Metrics Button with Weight Update Functionality */}
                                <div>
                                    {isEditing ? (
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="number"
                                                placeholder="Enter new weight"
                                                className="border p-2 rounded"
                                                value={newWeight}
                                                onChange={(e) =>
                                                    setNewWeight(e.target.value)
                                                }
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleUpdateWeight}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                            {message && (
                                                <p className="mt-2 text-sm text-red-500">
                                                    {message}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                // Pre-fill the input with the current weight
                                                setNewWeight(weight.toString());
                                            }}
                                            className="flex items-center gap-2 bg-gray-200 rounded-full px-4 py-2 hover:bg-gray-300"
                                        >
                                            <span className="text-black">
                                                Edit Metrics
                                            </span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                width="24"
                                                height="24"
                                                fill="black"
                                            >
                                                <path d="M4 5h2v2H4zm4 0h2v2H8zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zM4 9h2v2H4zm4 0h2v2H8zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zM4 13h2v2H4zm4 0h2v2H8zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </div>

                {/* Right: PR Section */}
                <div className="w-1/4 p-6 flex flex-col justify-end">
                    <div className="flex flex-col items-center">
                        {/* Crown Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="48"
                            height="48"
                            fill="yellow"
                            stroke="black"
                            strokeWidth="2"
                        >
                            <path d="M12 2l3 6h6l-3 6 3 6h-6l-3 6-3-6H3l3-6-3-6h6l3-6z" />
                        </svg>
                        <div className="mt-4 p-4 bg-stone-800 rounded">
                            <h3 className="text-xl font-bold text-white">PR</h3>
                            <select className="mt-2 p-2 bg-gray-300 text-black w-full">
                                <option>Select muscle group</option>
                                <option>Chest</option>
                                <option>Back</option>
                                <option>Legs</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full bg-black text-white p-4 text-center">
                <p className="text-sm">
                    © 2025 Fitness Journal | Created by Grancea Alexandru
                </p>
            </footer>
        </div>
    );
};

export default MainPage;
