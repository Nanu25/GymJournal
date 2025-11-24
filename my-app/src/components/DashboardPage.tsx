import React, { useEffect, useState } from "react";
import PersonalRecordsCard from "./PersonalRecordsCard";
import TrainingSelector from "./TrainingSelector";
import { useAuth } from "../context/AuthContext";

interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

interface UserMetrics {
    weight?: number;
    height?: number;
}

interface DashboardPageProps {
    onLogout: () => void;
    onNavigateToMetricsSection: () => void;
    onNavigateToActivityLogs: () => void;
    onNavigateToChat: () => void;
    onNavigateToPRSection: () => void;
    navigateToTrainingSelector?: () => void;
}

const TRAININGS_CACHE_KEY = 'dashboard_trainings_cache';
const USER_METRICS_CACHE_KEY = 'dashboard_user_metrics_cache';
const USER_DATA_CACHE_KEY = 'dashboard_user_data_cache';

const DashboardPage: React.FC<DashboardPageProps> = ({ 
    onLogout, 
    onNavigateToMetricsSection,
    onNavigateToActivityLogs,
    onNavigateToChat,
    onNavigateToPRSection,
    navigateToTrainingSelector,
}) => {
    const [trainings, setTrainings] = useState<TrainingEntry[]>(() => {
        try {
            const cached = sessionStorage.getItem(TRAININGS_CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });
    const [hasCachedTrainings, setHasCachedTrainings] = useState(() => trainings.length > 0);
    const [showTrainingSelector, setShowTrainingSelector] = useState(false);
    const [username, setUsername] = useState<string>(() => {
        try {
            const cached = sessionStorage.getItem(USER_DATA_CACHE_KEY);
            if (cached) {
                const data = JSON.parse(cached);
                return data.name || "Fitness Enthusiast";
            }
        } catch {
            // Ignore cache errors
        }
        return "Fitness Enthusiast";
    });
    const [isAdmin, setIsAdmin] = useState<boolean>(() => {
        try {
            const cached = sessionStorage.getItem(USER_DATA_CACHE_KEY);
            if (cached) {
                const data = JSON.parse(cached);
                return data.isAdmin === true;
            }
        } catch {
            // Ignore cache errors
        }
        return false;
    });
    const [userMetrics, setUserMetrics] = useState<UserMetrics>(() => {
        try {
            const cached = sessionStorage.getItem(USER_METRICS_CACHE_KEY);
            return cached ? JSON.parse(cached) : {};
        } catch {
            return {};
        }
    });
    const { logout } = useAuth();

    useEffect(() => {
        const fetchUserData = async (): Promise<void> => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return; // Keep using cached/default username
                }
                
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
                        return; // Keep using cached/default username
                    }
                    
                    const data = await response.json();
                    
                    // Set username if available
                    if (data.name) {
                        setUsername(data.name);
                    }

                    const metrics: UserMetrics = {
                        weight: data.weight ?? data.metrics?.weight,
                        height: data.height ?? data.metrics?.height,
                    };
                    setUserMetrics(metrics);
                    sessionStorage.setItem(USER_METRICS_CACHE_KEY, JSON.stringify(metrics));

                    // Handle isAdmin
                    const adminStatus = data.isAdmin === true;
                    setIsAdmin(adminStatus);

                    // Cache user data (name and admin status)
                    try {
                        sessionStorage.setItem(USER_DATA_CACHE_KEY, JSON.stringify({
                            name: data.name || username,
                            isAdmin: adminStatus
                        }));
                    } catch (error) {
                        console.warn('Unable to cache user data:', error);
                    }
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
                    // Keep using cached/default username
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Error in fetchUserData:", error.message);
                } else {
                    console.error("Unknown error in fetchUserData");
                }
                // Keep using cached/default username
            }
        };

        // Only fetch if we don't have cached user data
        const hasCachedUserData = (() => {
            try {
                const cached = sessionStorage.getItem(USER_DATA_CACHE_KEY);
                return !!cached;
            } catch {
                return false;
            }
        })();

        if (!hasCachedUserData) {
            fetchUserData();
        } else {
            // Still fetch in background to update cache
            fetchUserData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const persistTrainings = (data: TrainingEntry[]) => {
        setTrainings(data);
        setHasCachedTrainings(true);
        try {
            sessionStorage.setItem(TRAININGS_CACHE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn('Unable to cache trainings:', error);
        }
    };

    const fetchTrainings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }
            const response = await fetch("/api/trainings?limit=0", {
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
                persistTrainings(data.data);
            } else {
                // Fallback for backward compatibility
                const parsed = Array.isArray(data) ? data : [];
                persistTrainings(parsed);
            }
        } catch (error) {
            console.error("Error fetching trainings:", error);
        }
    };

    useEffect(() => {
        if (!hasCachedTrainings) {
            fetchTrainings();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTrainingsChanged = (updatedTrainings: TrainingEntry[]) => {
        persistTrainings(updatedTrainings);
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
            // Immediately hide the training selector to show dashboard
            setShowTrainingSelector(false);
            
            // Scroll to top for better user experience
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }
            
            // Fetch the updated list of trainings after adding a new one
            const response = await fetch("/api/trainings?limit=0", {
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
                persistTrainings(data.data);
            } else {
                // Fallback for backward compatibility
                persistTrainings(Array.isArray(data) ? data : []);
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
                    <header className="w-full bg-[#0f172a]/50 backdrop-blur-xl border-b border-blue-500/10 top-0 z-50 sticky">
                        <div className="container mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4">
                            <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                                <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3">
                                    <button
                                        onClick={onNavigateToPRSection}
                                        className="px-4 py-2.5 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 font-medium min-w-[100px]"
                                    >
                                        PR Section
                                    </button>
                                    <button
                                        onClick={onNavigateToChat}
                                        className="px-4 py-2.5 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 font-medium min-w-[120px]"
                                    >
                                        Chat with AI
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={onNavigateToActivityLogs}
                                            className="px-4 py-2.5 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-medium min-w-[160px]"
                                        >
                                            View Activity Logs
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { logout(); onLogout(); }}
                                        className="px-5 py-2.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 min-w-[100px]"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Responsive Main Content */}
                    <main className="container mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8">
                        <PersonalRecordsCard
                            trainings={trainings}
                            setTrainings={setTrainings}
                            onNavigateToMetricsSection={onNavigateToMetricsSection}
                            onNavigateToTrainingSelector={handleNavigateToTrainingSelector}
                            onTrainingChange={handleTrainingsChanged}
                            profile={{
                                name: username,
                                weight: userMetrics.weight,
                                height: userMetrics.height,
                            }}
                            hasCachedInitialTrainings={hasCachedTrainings}
                            onRequestFullRefresh={fetchTrainings}
                        />
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