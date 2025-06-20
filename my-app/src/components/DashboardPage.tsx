"use client";

import React, { useEffect, useState } from "react";
import WelcomeHeader from "./WelcomeHeader";
import PersonalRecordsCard from "./PersonalRecordsCard";
import PRSection from "./PRSection";
import TrainingSelector from "./TrainingSelector";
import { useAuth } from "../context/AuthContext";

interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

interface DashboardPageProps {
    onLogout: () => void;
    onNavigateToMetricsSection: () => void;
    onNavigateToActivityLogs: () => void;
    navigateToTrainingSelector?: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
    onLogout, 
    onNavigateToMetricsSection,
    onNavigateToActivityLogs,
    navigateToTrainingSelector,
}) => {
    const [trainings, setTrainings] = useState<TrainingEntry[]>([]);
    const [showTrainingSelector, setShowTrainingSelector] = useState(false);
    const [username, setUsername] = useState<string>("Fitness Enthusiast"); // Default username
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const { logout } = useAuth();

    useEffect(() => {
        console.log('isAdmin value changed:', isAdmin);
    }, [isAdmin]);

    useEffect(() => {
        const fetchUserData = async (): Promise<void> => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return; // Keep using default username
                }
                
                console.log('Fetching user data with token:', token);
                
                // Create controller for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
                
                try {
                    const response = await fetch("/api/user", {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        signal: controller.signal
                    });
                    
                    // Clear the timeout
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) {
                        console.warn(`User data fetch returned status ${response.status}`);
                        return; // Keep using default username
                    }
                    
                    const data = await response.json();
                    console.log('Received user data:', data);
                    
                    // Set username if available
                    if (data.name) {
                        setUsername(data.name);
                    } else {
                        console.warn('No name in user data:', data);
                        // Keep using default username
                    }

                    // Handle isAdmin
                    console.log('Raw isAdmin value from API:', data.isAdmin);
                    const adminStatus = data.isAdmin === true;
                    console.log('Processed admin status:', adminStatus);
                    setIsAdmin(adminStatus);
                } catch (fetchError: unknown) {
                    // Handle fetch errors
                    if (fetchError instanceof Error) {
                        if (fetchError.name === 'AbortError') {
                            console.error('User data request timed out');
                        } else {
                            console.error('Error fetching user data:', fetchError.message);
                        }
                    } else {
                        console.error('Unknown error fetching user data');
                    }
                    // Keep using default username
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Error in fetchUserData:", error.message);
                } else {
                    console.error("Unknown error in fetchUserData");
                }
                // Keep using default username, reset admin status
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
                // Extract trainings from the paginated response
                if (data.data && Array.isArray(data.data)) {
                    setTrainings(data.data);
                    console.log("Fetched trainings:", data.data);
                } else {
                    // Fallback for backward compatibility
                    setTrainings(Array.isArray(data) ? data : []);
                    console.log("Fetched trainings (old format):", data);
                }
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
        if (navigateToTrainingSelector) {
            navigateToTrainingSelector();
        } else {
            setShowTrainingSelector(true);
        }
    };

    const handleTrainingAdded = async () => {
        try {
            console.log("Training added successfully, redirecting to dashboard...");
            
            // Immediately hide the training selector to show dashboard
            setShowTrainingSelector(false);
            
            // Scroll to top for better user experience
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
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
            // Extract trainings from the paginated response
            if (data.data && Array.isArray(data.data)) {
                setTrainings(data.data);
            } else {
                // Fallback for backward compatibility
                setTrainings(Array.isArray(data) ? data : []);
            }

            // Add a small delay to ensure smooth transition
            setTimeout(() => {
                // Find and scroll to the PersonalRecordsCard
                const personalRecordsCard = document.getElementById('personal-records-card');
                if (personalRecordsCard) {
                    personalRecordsCard.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } catch (error) {
            console.error("Error fetching updated trainings:", error);
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
                    {/* Responsive Header */}
                    <header className="w-full bg-[#0f172a]/50 backdrop-blur-xl border-b border-blue-500/10 top-0 z-50">
                        <div className="container mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <WelcomeHeader username={username} />
                                <div className="flex items-center space-x-2 sm:space-x-4 ml-0 sm:ml-8">
                                    {isAdmin && (
                                        <button
                                            onClick={onNavigateToActivityLogs}
                                            className="px-4 py-2 text-sm sm:text-base bg-blue-500 text-black rounded hover:bg-blue-600 min-w-[44px] min-h-[44px]"
                                        >
                                            View Activity Logs
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { logout(); onLogout(); }}
                                        className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-bold text-black bg-white rounded-xl shadow hover:bg-blue-100 border border-blue-100 transition-all duration-200 min-w-[44px] min-h-[44px] mr-2"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Responsive Main Content */}
                    <main className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8">
                        <div className="flex flex-col lg:flex-row gap-y-8 lg:gap-x-8">
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

                    {/* Responsive Footer */}
                    <footer className="w-full bg-[#0f172a]/50 backdrop-blur-xl border-t border-blue-500/10 mt-12">
                        <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4">
                            <p className="text-center text-xs sm:text-sm md:text-base text-blue-200/70 font-medium">
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