import RegistrationForm from "./RegistrationForm";

interface RegistrationPageProps {
  onNavigateToLogin: () => void;
}

function RegistrationPage({
  onNavigateToLogin,
}: RegistrationPageProps) {
  const handleNavigateToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center overflow-hidden relative selection:bg-blue-500/30">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Spotlight Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#1e293b,transparent)]"></div>

      {/* Side Decorations - Vertical Lines */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden xl:block ml-24"></div>
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden xl:block mr-24"></div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center justify-center min-h-screen py-12">
        <div className="w-full space-y-12">
          {/* Brand Header */}
          <div className="space-y-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Movement</span>
              </h1>
              <p className="text-slate-400 text-lg font-light tracking-wide max-w-lg mx-auto">
                Start your journey to a stronger, healthier you today.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="backdrop-blur-sm bg-white/0 p-2">
            <RegistrationForm onNavigateToLogin={handleNavigateToLogin} />
          </div>

          {/* Footer - Contact Only */}
          <div className="text-center pt-8">
            <a href="mailto:support@fitnessjournal.com" className="text-sm text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-medium border-b border-transparent hover:border-white/20 pb-1">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
