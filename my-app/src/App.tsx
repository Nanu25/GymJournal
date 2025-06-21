import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import GymJournalRegistration from "./components/GymJournalRegistration";
import EditMetrics from "./components/EditMetrics"; // Import EditMetrics component
import TrainingSelector from "@/components/TrainingSelector.tsx";
import { ActivityLogs } from "./components/ActivityLogs";
import { useAuth } from "./context/AuthContext";

const App = () => {
    const { token } = useAuth();
    const [currentPage, setCurrentPage] = useState("login");

    useEffect(() => {
        if (token) {
            setCurrentPage("dashboard");
        } else {
            setCurrentPage("login");
        }
    }, [token]);

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
    };

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
                    onNavigateToActivityLogs={navigateToActivityLogs}
                    navigateToTrainingSelector={navigateToTrainingSelector}
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
                    onTrainingAdded={() => {
                        navigateToDashboard();
                        // Optionally refresh the dashboard data here if needed
                    }}
                    onCancel={navigateToDashboard}
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
