import { useState } from "react";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import GymJournalRegistration from "./components/GymJournalRegistration";
import EditMetrics from "./components/EditMetrics"; // Import EditMetrics component
import TrainingSelector from "@/components/TrainingSelector.tsx";


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

    // Function to add a new training session
    const addTrainingSession = (exerciseData: { [exercise: string]: number }) => {
        const newId = trainingSessions.length + 1; // Simple ID generation
        const newSession: TrainingSessionData = {
            id: newId,
            exerciseData,
        };
        setTrainingSessions([...trainingSessions, newSession]);
    };

    return (
        <div className="w-screen h-screen overflow-hidden flex flex-col">
            {currentPage === "login" && (
                <LoginPage
                    onLoginSuccess={navigateToDashboard}
                    onNavigateToRegistration={navigateToRegistration}
                />
            )}
            {currentPage === "dashboard" && (
                <DashboardPage
                    onLogout={navigateToLogin}
                    onNavigateToMetricsSection={navigateToMetricsSection} // Pass the navigation function
                    navigateToTrainingSelector={navigateToTrainingSelector}
                    weight={weight} // Pass the weight state to the DashboardPage component
                    // trainingSessions={trainingSessions}
                />
            )}
            {currentPage === "registration" && (
                <GymJournalRegistration
                    onNavigateToLogin={navigateToLogin}
                />
            )}
            {currentPage === "editMetrics" && (
                <EditMetrics onBackToDashboard={navigateToDashboard}
                                weight={weight}
                                setWeight={setWeight}
                />
            )}

            {currentPage === "trainingSelector" && (
                <TrainingSelector
                    onBackToDashboard={navigateToDashboard}
                />
            )}

        </div>
    );
};

export default App;
