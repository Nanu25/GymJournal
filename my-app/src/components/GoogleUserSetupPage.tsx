"use client";
import GoogleUserDetailsForm from "./GoogleUserDetailsForm";

interface GoogleUserSetupPageProps {
  onComplete: () => void;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function GoogleUserSetupPage({
  onComplete,
  user,
}: GoogleUserSetupPageProps) {
  return (
    <div className="min-h-screen w-full relative bg-slate-900 flex flex-col">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-green-500/10 via-blue-500/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiA0OGM2LjYyNyAwIDEyLTUuMzczIDEyLTEycy01LjM3My0xMi0xMi0xMi0xMiA1LjM3My0xMiAxMiA1LjM3MyAxMiAxMiAxMnptMC0yYy01LjUyMyAwLTEwLTQuNDc3LTEwLTEwczQuNDc3LTEwIDEwLTEwIDEwIDQuNDc3IDEwIDEwLTQuNDc3IDEwLTEwIDEweiIgZmlsbD0iIzEwMTcyOCIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-500/30 rounded-full filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Main scrollable container with padding for footer */}
      <div className="flex-1 overflow-auto pb-24">
        <div className="flex min-h-full items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/10 p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-transparent opacity-50"></div>
              <div className="relative">
                <GoogleUserDetailsForm user={user} onComplete={onComplete} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed footer with glass effect */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/10 backdrop-blur-xl bg-slate-900/50 z-50">
        <div className="container mx-auto px-4 py-6">
          <p className="text-sm text-blue-200/70 text-center">
            © 2025 Fitness Journal | Created by Grancea Alexandru
          </p>
        </div>
      </footer>
    </div>
  );
}

export default GoogleUserSetupPage;

