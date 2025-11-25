import React, { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onNavigateToRegistration: () => void;
  onGoogleLoginSuccess: (user: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onNavigateToRegistration,
  onGoogleLoginSuccess,
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

  // GoogleLogin component returns an ID token via `credential` which matches backend verification

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 mb-16">
      <div className="flex flex-col gap-8 max-w-md mx-auto w-full">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-2xl backdrop-blur-md">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-16 px-6 text-lg text-white bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 placeholder:text-white/20"
            />
            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>
        </div>

        {/* Password Input */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-16 px-6 text-lg text-white bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 placeholder:text-white/20"
            />
            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-purple-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <div className="group relative mt-2">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-gradient-x"></div>
          <button
            type="button"
            onClick={handleLogin}
            disabled={isSubmitting}
            className="relative w-full h-16 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200 shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span>{isSubmitting ? 'Logging in...' : 'Sign In'}</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#0f172a] text-white/40 uppercase tracking-wider font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <div className="w-full flex justify-center transform hover:scale-[1.02] transition-transform duration-200">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (!credentialResponse.credential) {
                setError("Google login failed");
                return;
              }
              setError(null);
              setIsSubmitting(true);
              try {
                const response = await api.auth.loginWithGoogle({ token: credentialResponse.credential });
                if (response.success) {
                  const appToken = response.data?.token || '';
                  const user = response.data?.user || {};
                  const createdNewUser = Boolean(response.data?.createdNewUser);
                  localStorage.setItem('token', appToken);

                  if (createdNewUser) {
                    onGoogleLoginSuccess(user);
                  } else {
                    login(appToken, user);
                    onLoginSuccess();
                  }
                } else {
                  setError(response.error || "Google login failed");
                }
              } catch (err) {
                setError("An error occurred during Google login");
              } finally {
                setIsSubmitting(false);
              }
            }}
            onError={() => setError("Google login failed")}
            useOneTap={false}
            theme="filled_blue"
            size="large"
            text="continue_with"
            shape="pill"
            logo_alignment="left"
            locale="en"
            width="100%"
          />
        </div>

        {/* Sign Up Link */}
        <div className="relative mt-4 text-center">
          <p className="text-lg text-white/60">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleSignup}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors duration-300 hover:underline decoration-2 underline-offset-4"
              id="signup-button"
            >
              Create one now
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
