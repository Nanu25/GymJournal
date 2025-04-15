"use client";
import React from "react";
import RegistrationForm from "./RegistrationForm";
import WelcomeSection from "./WelcomeSection";
import RightSection from "./RightSection";
import DecorativeElements from "./DecorativeElements";

interface GymJournalRegistrationProps {
  onNavigateToLogin: () => void;
}

function GymJournalRegistration({
  onNavigateToLogin,
}: GymJournalRegistrationProps) {
  // Function to handle navigation to login
  const handleNavigateToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      console.log(
        "Navigation to login page requested, but handler not provided"
      );
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col pt-10 pb-10"
      style={{
        background:
          "linear-gradient(to bottom, #09205A 31%, #4E6496 90%, #C2D8FB 100%)",
      }}
    >
      <main className="flex justify-center items-center flex-grow p-5 w-full overflow-y-auto">
        <div className="w-full md:w-1/2">
          <RegistrationForm onNavigateToLogin={handleNavigateToLogin} />
        </div>
      </main>

      {/* Footer - fixed at the bottom */}
      <footer className="w-full bg-black text-white p-4 text-center">
        <p className="text-sm">
          © 2025 Fitness Journal | Created by Grancea Alexandru
        </p>
      </footer>
    </div>
  );
}

export default GymJournalRegistration;
