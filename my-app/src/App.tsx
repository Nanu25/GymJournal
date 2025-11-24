import { useState, useEffect, useRef } from "react";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import GymJournalRegistration from "./components/GymJournalRegistration";
import EditMetrics from "./components/EditMetrics"; // Import EditMetrics component
import TrainingSelector from "@/components/TrainingSelector.tsx";
import { ActivityLogs } from "./components/ActivityLogs";
import ChatPage from "./components/ChatPage";
import GoogleUserSetupPage from "./components/GoogleUserSetupPage";
import PRSectionPage from "./components/PRSectionPage";
import { useAuth } from "./context/AuthContext";

const App = () => {
    const { token } = useAuth();
    const [currentPage, setCurrentPage] = useState("login");
    const [googleUser, setGoogleUser] = useState<any>(null);
    const prHistoryEntryAdded = useRef(false);
    const trainingSelectorHistoryAdded = useRef(false);
    const editMetricsHistoryAdded = useRef(false);

    useEffect(() => {
        if (token) {
            setCurrentPage("dashboard");
        } else {
            setCurrentPage("login");
        }
    }, [token]);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (currentPage !== "prSection") {
            prHistoryEntryAdded.current = false;
        }
        if (currentPage !== "trainingSelector") {
            trainingSelectorHistoryAdded.current = false;
        }
        if (currentPage !== "editMetrics") {
            editMetricsHistoryAdded.current = false;
        }

        // Handle PR Section
        if (currentPage === "prSection") {
            const handlePopState = () => {
                prHistoryEntryAdded.current = false;
                setCurrentPage("dashboard");
            };

            window.history.pushState({ page: "prSection" }, "", "#pr-section");
            prHistoryEntryAdded.current = true;
            window.addEventListener("popstate", handlePopState);

            return () => {
                window.removeEventListener("popstate", handlePopState);
            };
        }

        // Handle Training Selector
        if (currentPage === "trainingSelector") {
            const handlePopState = () => {
                trainingSelectorHistoryAdded.current = false;
                setCurrentPage("dashboard");
            };

            window.history.pushState({ page: "trainingSelector" }, "", "#add-training");
            trainingSelectorHistoryAdded.current = true;
            window.addEventListener("popstate", handlePopState);

            return () => {
                window.removeEventListener("popstate", handlePopState);
            };
        }

        // Handle Edit Metrics
        if (currentPage === "editMetrics") {
            const handlePopState = () => {
                editMetricsHistoryAdded.current = false;
                setCurrentPage("dashboard");
            };

            window.history.pushState({ page: "editMetrics" }, "", "#edit-metrics");
            editMetricsHistoryAdded.current = true;
            window.addEventListener("popstate", handlePopState);

            return () => {
                window.removeEventListener("popstate", handlePopState);
            };
        }
    }, [currentPage]);

    const navigateToDashboard = () => {
        setCurrentPage("dashboard");
    };

    const navigateToLogin = () => {
        setCurrentPage("login");
    };

    const navigateToRegistration = () => {
        setCurrentPage("registration");
    };

    const navigateToMetricsSection = () => {
        setCurrentPage("editMetrics");
    };

    const navigateToTrainingSelector = () => {
        setCurrentPage("trainingSelector");
    };

    const navigateToActivityLogs = () => {
        setCurrentPage("activityLogs");
    };

    const navigateToChat = () => {
        setCurrentPage("chat");
    };

    const navigateToPRSection = () => {
        setCurrentPage("prSection");
    };

    const navigateBackFromPRSection = () => {
        if (typeof window !== "undefined" && prHistoryEntryAdded.current) {
            window.history.back();
        } else {
            setCurrentPage("dashboard");
        }
    };

    const handleGoogleLoginSuccess = (user: any) => {
        setGoogleUser(user);
        setCurrentPage("googleSetup");
    };

    const handleGoogleSetupComplete = () => {
        setGoogleUser(null);
        setCurrentPage("dashboard");
    };

    return (
        <div className="w-screen h-screen flex flex-col">
            {currentPage === "login" && (
                <LoginPage
                    onLoginSuccess={navigateToDashboard}
                    onNavigateToRegistration={navigateToRegistration}
                    onGoogleLoginSuccess={handleGoogleLoginSuccess}
                />
            )}
            {currentPage === "dashboard" && (
                <DashboardPage
                    onLogout={navigateToLogin}
                    onNavigateToMetricsSection={navigateToMetricsSection}
                    onNavigateToActivityLogs={navigateToActivityLogs}
                    onNavigateToChat={navigateToChat}
                    onNavigateToPRSection={navigateToPRSection}
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
            {currentPage === "chat" && (
                <ChatPage onBackToDashboard={navigateToDashboard} />
            )}
            {currentPage === "prSection" && (
                <PRSectionPage onBackToDashboard={navigateBackFromPRSection} />
            )}
            {currentPage === "googleSetup" && googleUser && (
                <GoogleUserSetupPage
                    user={googleUser}
                    onComplete={handleGoogleSetupComplete}
                />
            )}
        </div>
    );
};

export default App;
