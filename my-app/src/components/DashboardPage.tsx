import React, { useEffect, useState } from "react";
import PersonalRecordsCard from "./PersonalRecordsCard";


interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

interface UserMetrics {
    weight?: number;
    height?: number;
}

const TRAININGS_CACHE_KEY = 'dashboard_trainings_cache';
const USER_METRICS_CACHE_KEY = 'dashboard_user_metrics_cache';
const USER_DATA_CACHE_KEY = 'dashboard_user_data_cache';

const DashboardPage: React.FC = () => {
    const [trainings, setTrainings] = useState<TrainingEntry[]>(() => {
        try {
            const cached = sessionStorage.getItem(TRAININGS_CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });
    const [hasCachedTrainings, setHasCachedTrainings] = useState(() => trainings.length > 0);
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

    const [userMetrics, setUserMetrics] = useState<UserMetrics>(() => {
        try {
            const cached = sessionStorage.getItem(USER_METRICS_CACHE_KEY);
            return cached ? JSON.parse(cached) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        const fetchUserData = async (): Promise<void> => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                try {
                    const response = await fetch("/api/user", {
                        headers: { 'Authorization': `Bearer ${token}` },
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (!response.ok) return;

                    const data = await response.json();
                    if (data.name) setUsername(data.name);

                    const metrics: UserMetrics = {
                        weight: data.weight ?? data.metrics?.weight,
                        height: data.height ?? data.metrics?.height,
                    };
                    setUserMetrics(metrics);
                    sessionStorage.setItem(USER_METRICS_CACHE_KEY, JSON.stringify(metrics));

                    try {
                        sessionStorage.setItem(USER_DATA_CACHE_KEY, JSON.stringify({
                            name: data.name || username,
                        }));
                    } catch (error) {
                        console.warn('Unable to cache user data:', error);
                    }
                } catch (fetchError: unknown) {
                    if (fetchError instanceof Error) {
                        if (fetchError.name === 'AbortError') {
                            console.error('User data request timed out');
                        } else {
                            console.error('Error fetching user data:', fetchError.message);
                        }
                    } else {
                        console.error('Unknown error fetching user data');
                    }
                }
            } catch (error: unknown) {
                console.error("Error in fetchUserData:", error instanceof Error ? error.message : "Unknown error");
            }
        };

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
            if (!token) throw new Error('Not authenticated');
            const response = await fetch("/api/trainings?limit=0", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch trainings");
            const data = await response.json();
            if (data.data && Array.isArray(data.data)) {
                persistTrainings(data.data);
            } else {
                const parsed = Array.isArray(data) ? data : [];
                persistTrainings(parsed);
            }
        } catch (error) {
            console.error("Error fetching trainings:", error);
        }
    };

    useEffect(() => {
        // Always fetch fresh data in the background to ensure the list is up-to-date
        fetchTrainings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTrainingsChanged = (updatedTrainings: TrainingEntry[]) => {
        persistTrainings(updatedTrainings);
    };

    return (
        <div className="min-h-screen bg-[#080b14] overflow-x-hidden">
            {/* Responsive Main Content */}
            <main className="container mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8">
                <PersonalRecordsCard
                    trainings={trainings}
                    setTrainings={setTrainings}
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
        </div>
    );
};

export default DashboardPage;