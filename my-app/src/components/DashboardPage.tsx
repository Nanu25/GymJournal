import React from "react";
import PersonalRecordsCard from "./PersonalRecordsCard";
import { useUserProfile } from "../hooks/useUserProfile";

const DashboardPage: React.FC = () => {
    // Use custom hook for user profile
    const { profile } = useUserProfile();

    return (
        <div className="min-h-full flex flex-col bg-[#080b14] overflow-x-hidden">
            {/* Responsive Main Content */}
            <main className="flex-1 container mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-8">
                <PersonalRecordsCard
                    profile={profile}
                />
            </main>

            {/* Responsive Footer */}
            <footer className="w-full bg-[#0f172a]/50 backdrop-blur-xl border-t border-blue-500/10 mt-auto">
                <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4">
                    <p className="text-center text-xs sm:text-sm md:text-base text-blue-200/70 font-medium">
                        © 2025 Fitness Journal | Created by <a href="https://agportfolio-a13e2a8e20e4.herokuapp.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Grancea Alexandru</a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default DashboardPage;