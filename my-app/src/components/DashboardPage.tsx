"use client";

import React, { useEffect, useState } from "react";
import WelcomeHeader from "./WelcomeHeader";
import PersonalRecordsCard from "./PersonalRecordsCard";
import PRSection from "./PRSection";
import TrainingSelector from "./TrainingSelector";

interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

interface DashboardPageProps {
    onLogout: () => void;
    onNavigateToMetricsSection: () => void;
    onNavigateToActivityLogs: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
    onLogout, 
    onNavigateToMetricsSection,
    onNavigateToActivityLogs 
}) => {
    const [trainings, setTrainings] = useState<TrainingEntry[]>([]);
    const [showTrainingSelector, setShowTrainingSelector] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        console.log('isAdmin value changed:', isAdmin);
    }, [isAdmin]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }
                console.log('Fetching user data with token:', token);
                const response = await fetch("/api/user", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                console.log('Received user data:', data);
                
                // Set username
                if (data.name) {
                    setUsername(data.name);
                } else {
                    console.error('No name in user data:', data);
                }

                // Handle isAdmin
                console.log('Raw isAdmin value from API:', data.isAdmin);
                const adminStatus = data.isAdmin === true;
                console.log('Processed admin status:', adminStatus);
                setIsAdmin(adminStatus);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUsername("");
                setIsAdmin(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Not authenticated');
                }
                const response = await fetch("/api/trainings", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch trainings");
                }
                const data = await response.json();
                setTrainings(data);
            } catch (error) {
                console.error("Error fetching trainings:", error);
            }
        };

        fetchTrainings();
    }, []);

    const handleTrainingsChanged = (updatedTrainings: TrainingEntry[]) => {
        setTrainings(updatedTrainings);
    };

    const handleNavigateToTrainingSelector = () => {
        setShowTrainingSelector(true);
    };

    const handleTrainingAdded = async (newTraining: TrainingEntry) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }
            // Fetch the updated list of trainings after adding a new one
            const response = await fetch("/api/trainings", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch updated trainings");
            }
            const data = await response.json();
            setTrainings(data);
            setShowTrainingSelector(false);
        } catch (error) {
            console.error("Error fetching updated trainings:", error);
            // Still hide the selector but show an error
            setShowTrainingSelector(false);
            alert("Training added but failed to refresh the list. Please reload the page.");
        }
    };

    return (
        <div className="min-h-screen bg-[#080b14] overflow-x-hidden">
            {showTrainingSelector ? (
                <TrainingSelector
                    onTrainingAdded={handleTrainingAdded}
                    onCancel={() => setShowTrainingSelector(false)}
                />
            ) : (
                <>
                    <header className="w-full bg-[#0f172a]/50 backdrop-blur-xl border-b border-blue-500/10  top-0 z-50">
                        <div className="container mx-auto px-6 py-4">
                            <div className="flex justify-between items-center">
                                <WelcomeHeader username={username} onLogout={onLogout} />
                                
                                    <button
                                        onClick={onNavigateToActivityLogs}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        View Activity Logs
                                    </button>
                            </div>
                        </div>
                    </header>
 
                    <main className="container mx-auto px-6 py-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-[60%]">
                                <PersonalRecordsCard
                                    trainings={trainings}
                                    setTrainings={setTrainings}
                                    onNavigateToMetricsSection={onNavigateToMetricsSection}
                                    onNavigateToTrainingSelector={handleNavigateToTrainingSelector}
                                    onTrainingChange={handleTrainingsChanged}
                                />
                            </div>
                            <div className="w-full lg:w-[40%] sticky top-24">
                                <PRSection trainings={trainings} />
                            </div>
                        </div>
                    </main>

                    <footer className="w-full bg-[#0f172a]/50 backdrop-blur-xl border-t border-blue-500/10 mt-12">
                        <div className="container mx-auto px-6 py-4">
                            <p className="text-center text-blue-200/70 font-medium">
                                © 2025 Fitness Journal | Created by Grancea Alexandru
                            </p>
                        </div>
                    </footer>
                    
                </>
            )}
        </div>
    );
};

export default DashboardPage;