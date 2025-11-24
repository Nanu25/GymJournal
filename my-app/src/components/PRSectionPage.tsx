import React, { useEffect, useState } from "react";
import PRSection from "./PRSection";

interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

interface PRSectionPageProps {
    onBackToDashboard: () => void;
}

const TRAININGS_CACHE_KEY = 'dashboard_trainings_cache';

const PRSectionPage: React.FC<PRSectionPageProps> = ({ onBackToDashboard }) => {
    // Try to load from cache first for instant display
    const [trainings, setTrainings] = useState<TrainingEntry[]>(() => {
        try {
            const cached = sessionStorage.getItem(TRAININGS_CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Not authenticated");
                }

                const response = await fetch("/api/trainings?limit=0", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch trainings");
                }

                const data = await response.json();
                const fetchedTrainings = data.data && Array.isArray(data.data)
                    ? data.data
                    : Array.isArray(data) ? data : [];

                setTrainings(fetchedTrainings);

                // Update cache
                try {
                    sessionStorage.setItem(TRAININGS_CACHE_KEY, JSON.stringify(fetchedTrainings));
                } catch (error) {
                    console.warn('Unable to cache trainings:', error);
                }
            } catch (error) {
                console.error("Error fetching trainings:", error);
                // Only show error if we don't have cached data
                if (trainings.length === 0) {
                    setErrorMessage("Unable to load training history.");
                }
            }
        };

        // Only show loading if we have no cached data
        if (trainings.length === 0) {
            setIsLoading(true);
            fetchTrainings().finally(() => setIsLoading(false));
        } else {
            // Fetch fresh data in background
            fetchTrainings();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30 overflow-x-hidden">
            <header className="w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 supports-[backdrop-filter]:bg-[#0f172a]/80">
                <div className="container mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-1">Analytics</p>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
                            Personal Records
                        </h1>
                    </div>
                    <button
                        onClick={onBackToDashboard}
                        className="group flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 backdrop-blur-sm"
                    >
                        <svg
                            className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {isLoading && trainings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="relative w-16 h-16 mb-4">
                            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-blue-200/80 font-medium animate-pulse">Loading analytics...</p>
                    </div>
                ) : errorMessage && trainings.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center max-w-md">
                            <p className="text-red-400 font-medium">{errorMessage}</p>
                        </div>
                    </div>
                ) : (
                    <section className="w-full max-w-7xl mx-auto pb-20">
                        <PRSection trainings={trainings} />
                    </section>
                )}
            </main>
        </div>
    );
};

export default PRSectionPage;
