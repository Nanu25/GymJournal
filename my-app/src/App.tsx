import { useState } from "react";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import GymJournalRegistration from "./components/GymJournalRegistration";
import EditMetrics from "./components/EditMetrics"; // Import EditMetrics component
import TrainingSelector from "@/components/TrainingSelector.tsx";
import { ActivityLogs } from "./components/ActivityLogs";


interface TrainingSessionData {
    id: number;
    exerciseData: { [exercise: string]: number };
}

const App = () => {
    const [currentPage, setCurrentPage] = useState("login");
    const [weight, setWeight] = useState(75); // Mock user weight, set an initial value
    const [trainingSessions, setTrainingSessions] = useState<TrainingSessionData[]>([
        {
            id: 1,
            exerciseData: {
                "Dumbbell Press": 50,      // Chest
                "Incline Dumbbell": 40,    // Chest
                "Pullup": 10,              // Back
                "Dumbbell Row": 35,        // Back
            },
        },
        {
            id: 2,
            exerciseData: {
                "Squats": 100,             // Legs
                "Leg Curl": 60,            // Legs
                "Biceps Curl": 20,         // Arms
                "Cable Triceps Pushdown": 25, // Arms
            },
        },
    ]);

    const navigateToDashboard = () => {
        setCurrentPage("dashboard");
    };

    const navigateToLogin = () => {
        setCurrentPage("login");
    };

    const navigateToRegistration = () => {
        setCurrentPage("registration");
    };

    // Update this function to set currentPage to "editMetrics"
    const navigateToMetricsSection = () => {
        setCurrentPage("editMetrics");
    };

    const navigateToTrainingSelector = () => {
        setCurrentPage("trainingSelector");
    }

    const navigateToActivityLogs = () => {
        setCurrentPage("activityLogs");
    };

    return (
        <div className="w-screen h-screen flex flex-col">
            {currentPage === "login" && (
                <LoginPage
                    onLoginSuccess={navigateToDashboard}
                    onNavigateToRegistration={navigateToRegistration}
                />
            )}
            {currentPage === "dashboard" && (
                <DashboardPage
                    onLogout={navigateToLogin}
                    onNavigateToMetricsSection={navigateToMetricsSection}
                    navigateToTrainingSelector={navigateToTrainingSelector}
                    onNavigateToActivityLogs={navigateToActivityLogs}
                    weight={weight}
                />
            )}
            {currentPage === "registration" && (
                <GymJournalRegistration
                    onNavigateToLogin={navigateToLogin}
                />
            )}
            {currentPage === "editMetrics" && (
                <EditMetrics onBackToDashboard={navigateToDashboard} />
            )}
            {currentPage === "trainingSelector" && (
                <TrainingSelector
                    onBackToDashboard={navigateToDashboard}
                />
            )}
            {currentPage === "activityLogs" && (
                <div className="flex flex-col h-full">
                    <div className="bg-white border-b border-gray-200 px-4 py-3">
                        <button 
                            onClick={navigateToDashboard}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <ActivityLogs />
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
