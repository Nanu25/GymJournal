import React from "react";
import WelcomeSection from "./WelcomeSection";
import LoginForm from "./LoginForm";
import RightSection from "./RightSection";

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToRegistration?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegistration,
}) => {

  const handleNavigateToRegistration = () => {
    if (onNavigateToRegistration) {
      onNavigateToRegistration();
    } else {
      console.log(
        "Navigation to registration page requested, but handler not provided"
      );
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-y-auto"
      style={{
        background:
          "linear-gradient(to bottom, #09205A 31%, #4E6496 90%, #C2D8FB 100%)",
      }}
    >
      <main className="flex flex-col md:flex-row justify-between p-5 w-full">
        <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <WelcomeSection />
          <LoginForm
            onLoginSuccess={onLoginSuccess}
            onNavigateToRegistration={handleNavigateToRegistration}
          />
        </div>
        <div className="w-full md:w-1/2">
          <RightSection />
        </div>
      </main>

      {/* Footer - positioned at the bottom but scrollable */}
      <footer className="w-full bg-black text-white p-4 text-center">
        <p className="text-sm">
          © 2025 Fitness Journal | Created by Grancea Alexandru
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
