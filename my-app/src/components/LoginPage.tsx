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
    <div className="min-h-screen w-full overflow-auto relative bg-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-blue-500/10 via-purple-500/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiA0OGM2LjYyNyAwIDEyLTUuMzczIDEyLTEycy01LjM3My0xMi0xMi0xMi0xMiA1LjM3My0xMiAxMiA1LjM3MyAxMiAxMiAxMnptMC0yYy01LjUyMyAwLTEwLTQuNDc3LTEwLTEwczQuNDc3LTEwIDEwLTEwIDEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEweiIgZmlsbD0iIzEwMTcyOCIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content container - fully scrollable */}
      <div className="relative min-h-screen flex flex-col">
        <div className="container mx-auto px-4 flex-grow">
          <main className="flex flex-col md:flex-row justify-between py-8 gap-8">
            {/* Left section with form */}
            <div className="w-full md:w-1/2 md:sticky md:top-8 md:h-fit max-h-screen">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/10 p-8 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-50"></div>
                <div className="relative">
                  <WelcomeSection />
                  <LoginForm
                    onLoginSuccess={onLoginSuccess}
                    onNavigateToRegistration={handleNavigateToRegistration}
                  />
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="w-full md:w-1/2">
              <div className="md:sticky md:top-8">
                <RightSection />
              </div>
            </div>
          </main>
        </div>

        {/* Footer with glass effect - sticks to bottom when content is short */}
        <footer className="relative mt-auto border-t border-white/10 backdrop-blur-xl bg-slate-900/50">
          <div className="container mx-auto px-4 py-6">
            <p className="text-sm text-blue-200/70 text-center">
              © 2025 Fitness Journal | Created by Grancea Alexandru
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;