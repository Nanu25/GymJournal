import React, { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onNavigateToRegistration: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onNavigateToRegistration,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.auth.login({ email, password });
      if (response.success) {
        // Use AuthContext login function
        login(response.data?.token || '', response.data?.user || {});
        onLoginSuccess();
      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = () => {
    onNavigateToRegistration();
  };

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 mb-16">
      <div className="flex flex-col gap-6 max-w-[386px] mx-auto md:mx-0">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-all duration-500"></div>
          <input
            type="email"
            placeholder="Email..."
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="relative w-full h-[67px] px-6 text-lg text-white bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 placeholder:text-white/30"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg className="w-6 h-6 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
        </div>

        {/* Password Input */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 rounded-xl opacity-50 group-hover:opacity-75 transition-all duration-500"></div>
          <input
            type="password"
            placeholder="Password..."
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="relative w-full h-[67px] px-6 text-lg text-white bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 placeholder:text-white/30"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg className="w-6 h-6 text-purple-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Login Button */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-700 via-purple-300 to-blue-300 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <button
            type="button"
            onClick={handleLogin}
            disabled={isSubmitting}
            className="relative w-full h-[54px] text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl border border-blue-400 hover:border-blue-300 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="relative mt-6 text-center">
          <p className="text-lg text-white/70">
            <span>If you don't have an account, click </span>
            <button
              type="button"
              onClick={handleSignup}
              className="text-blue-300 hover:text-blue-300 font-medium cursor-pointer transition-colors duration-300"
              id="signup-button"
            >
              here to sign in
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
