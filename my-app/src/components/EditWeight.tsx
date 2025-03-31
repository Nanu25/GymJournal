import { useState } from "react";

export default function EditWeightButton() {
    const [weight, setWeight] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpdateWeight = async () => {
        try {
            const response = await fetch("/api/updateWeight", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weight: parseFloat(weight) }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Weight updated successfully!");
            } else {
                setMessage(data.error || "Failed to update weight");
            }
        } catch (error) {
            setMessage("Server error");
        }
    };

    return (
        <div>
            <button
                className="flex items-center gap-2 bg-gray-200 rounded-full px-4 py-2 hover:bg-gray-300"
                onClick={() => setIsEditing(true)}
            >
                <span className="text-black">Edit Metrics</span>
                {/* Fitness Icon */}
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

            {isEditing && (
                <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-white">
                    <input
                        type="number"
                        placeholder="Enter new weight"
                        className="border p-2 rounded"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                    <button
                        onClick={handleUpdateWeight}
                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Update
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="ml-2 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
                </div>
            )}
        </div>
    );
}
