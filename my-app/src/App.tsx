import { useState, useEffect, useRef } from "react";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import RegistrationPage from "./components/RegistrationPage";
import EditMetrics from "./components/EditMetrics"; // Import EditMetrics component
import TrainingSelector from "@/components/TrainingSelector.tsx";
import { ActivityLogs } from "./components/ActivityLogs";
import ChatPage from "./components/ChatPage";
import GoogleUserSetupPage from "./components/GoogleUserSetupPage";
import PRSectionPage from "./components/PRSectionPage";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import { Toaster } from "react-hot-toast";

const App = () => {
    const { token, logout } = useAuth();
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
        logout();
        setCurrentPage("login");
    };

    const navigateToRegistration = () => {
        setCurrentPage("registration");
    };





    const handleGoogleLoginSuccess = (user: any) => {
        setGoogleUser(user);
        setCurrentPage("googleSetup");
    };

    const handleGoogleSetupComplete = () => {
        setGoogleUser(null);
        setCurrentPage("dashboard");
    };

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
    };

    const showNavbar = !['login', 'registration', 'googleSetup'].includes(currentPage);

    return (
        <div className="w-screen h-screen flex flex-col bg-[#080b14] overflow-hidden">
            <Toaster position="top-center" toastOptions={{
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                },
            }} />
            {showNavbar && (
                <Navbar
                    currentPage={currentPage}
                    onNavigate={handleNavigate}
                    onLogout={navigateToLogin}
                />
            )}

            <div className="flex-1 overflow-auto">
                {currentPage === "login" && (
                    <LoginPage
                        onLoginSuccess={navigateToDashboard}
                        onNavigateToRegistration={navigateToRegistration}
                        onGoogleLoginSuccess={handleGoogleLoginSuccess}
                    />
                )}
                {currentPage === "dashboard" && (
                    <DashboardPage />
                )}
                {currentPage === "registration" && (
                    <RegistrationPage
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
                        <div className="flex-1 overflow-auto">
                            <ActivityLogs />
                        </div>
                    </div>
                )}
                {currentPage === "chat" && (
                    <ChatPage />
                )}
                {currentPage === "prSection" && (
                    <PRSectionPage />
                )}
                {currentPage === "googleSetup" && googleUser && (
                    <GoogleUserSetupPage
                        user={googleUser}
                        onComplete={handleGoogleSetupComplete}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
