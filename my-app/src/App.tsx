import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import RegistrationPage from "./components/RegistrationPage";
import EditMetrics from "./components/EditMetrics";
import TrainingSelector from "@/components/TrainingSelector.tsx";
import { ActivityLogs } from "./components/ActivityLogs";
import ChatPage from "./components/ChatPage";
import GoogleUserSetupPage from "./components/GoogleUserSetupPage";
import PRSectionPage from "./components/PRSectionPage";
import ContactPage from "./components/ContactPage";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { User } from "./types/index";
import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "react-hot-toast";

// Wrapper component to handle Google Login state which needs to be passed to GoogleUserSetupPage
const AppRoutes = () => {
    const { logout } = useAuth();
    const [googleUser, setGoogleUser] = useState<User | null>(null);
    const navigate = useNavigate();

    const handleGoogleLoginSuccess = (user: User) => {
        setGoogleUser(user);
        navigate("/google-setup");
    };

    const handleGoogleSetupComplete = () => {
        setGoogleUser(null);
        navigate("/dashboard");
    };

    return (
        <div className="w-screen h-screen flex flex-col bg-[#080b14] overflow-hidden">
            <Toaster position="top-center" toastOptions={{
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                },
            }} />

            {/* Navbar is shown on protected routes mostly, but we can control it via layout or check path */}
            {/* Ideally Navbar should be part of a Layout component for protected routes. 
                For now, we'll render it conditionally based on route or let pages handle it? 
                Actually, Navbar was global. Let's make it global but conditionally hidden. */}
            <NavbarWrapper onLogout={() => { logout(); navigate("/login"); }} />

            <div className="flex-1 overflow-auto">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={
                        <LoginPage
                            onLoginSuccess={() => navigate("/dashboard")}
                            onNavigateToRegistration={() => navigate("/register")}
                            onGoogleLoginSuccess={handleGoogleLoginSuccess}
                            onNavigateToContact={() => navigate("/contact")}
                        />
                    } />
                    <Route path="/register" element={
                        <RegistrationPage
                            onNavigateToLogin={() => navigate("/login")}
                            onNavigateToContact={() => navigate("/contact")}
                        />
                    } />
                    <Route path="/contact" element={
                        <ContactPage onNavigateToLogin={() => navigate("/login")} />
                    } />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/edit-metrics" element={
                        <ProtectedRoute>
                            <EditMetrics onBackToDashboard={() => navigate("/dashboard")} />
                        </ProtectedRoute>
                    } />
                    <Route path="/add-training" element={
                        <ProtectedRoute>
                            <TrainingSelector
                                onTrainingAdded={() => navigate("/dashboard")}
                                onCancel={() => navigate("/dashboard")}
                            />
                        </ProtectedRoute>
                    } />
                    <Route path="/activity-logs" element={
                        <ProtectedRoute>
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-auto">
                                    <ActivityLogs />
                                </div>
                            </div>
                        </ProtectedRoute>
                    } />
                    <Route path="/chat" element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/pr-section" element={
                        <ProtectedRoute>
                            <PRSectionPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/google-setup" element={
                        googleUser ? (
                            <GoogleUserSetupPage
                                user={googleUser}
                                onComplete={handleGoogleSetupComplete}
                                onNavigateToContact={() => navigate("/contact")}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } />

                    {/* Default Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </div>
        </div>
    );
};

// Helper to conditionally render Navbar
import { useLocation } from "react-router-dom";
const NavbarWrapper = ({ onLogout }: { onLogout: () => void }) => {
    const location = useLocation();
    const hideNavbarPaths = ['/login', '/register', '/google-setup', '/contact'];
    const showNavbar = !hideNavbarPaths.includes(location.pathname);

    if (!showNavbar) return null;

    return (
        <Navbar
            onLogout={onLogout}
        />
    );
};

const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
