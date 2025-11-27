import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';
import { AlertCircle, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

import { User } from "../types/index";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onNavigateToRegistration?: () => void;
  onGoogleLoginSuccess: (user: User) => void;
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
  const [shake, setShake] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.auth.login({ email, password });
      if (response.success) {
        login(response.data?.token || '', (response.data?.user as User) || null);
        onLoginSuccess();
      } else {
        setError(response.error || "Login failed");
        setShake(true);
      }
    } catch (err) {
      setError("An error occurred during login");
      setShake(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = () => {
    onNavigateToRegistration?.();
  };

  return (
    <div className={`flex flex-col gap-6 w-full transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl backdrop-blur-md flex items-center gap-3 animate-fade-in-up">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {/* Email Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-12 px-4 text-base text-white bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 transition-all duration-300 placeholder:text-slate-500 pl-11
                  ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20'}
                `}
                placeholder="name@example.com"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className={`w-5 h-5 ${error ? 'text-red-400/50' : 'text-slate-400'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-12 px-4 text-base text-white bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 transition-all duration-300 placeholder:text-slate-500 pl-11
                  ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20'}
                `}
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className={`w-5 h-5 ${error ? 'text-red-400/50' : 'text-slate-400'}`} />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">Forgot Password?</a>
          </div>
        </div>

        {/* Login Button */}
        <div className="group relative mt-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500 animate-gradient-x"></div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full h-12 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </span>
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-[#030712]/0 backdrop-blur-sm text-slate-500 uppercase tracking-wider font-medium">Or continue with</span>
        </div>
      </div>

      {/* Google Login Button */}
      <div className="w-full flex justify-center transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (!credentialResponse.credential) {
              setError("Google login failed");
              setShake(true);
              return;
            }
            setError(null);
            setIsSubmitting(true);
            try {
              const response = await api.auth.loginWithGoogle({ token: credentialResponse.credential });
              if (response.success) {
                const appToken = response.data?.token || '';
                const user = (response.data?.user as User) || null;
                const createdNewUser = Boolean(response.data?.createdNewUser);
                localStorage.setItem('token', appToken);

                if (createdNewUser && user) {
                  onGoogleLoginSuccess(user);
                } else if (user) {
                  login(appToken, user);
                  onLoginSuccess();
                } else {
                  throw new Error("Invalid user data received");
                }
              } else {
                setError(response.error || "Google login failed");
                setShake(true);
              }
            } catch (err) {
              setError("An error occurred during Google login");
              setShake(true);
            } finally {
              setIsSubmitting(false);
            }
          }}
          onError={() => {
            setError("Google login failed");
            setShake(true);
          }}
          useOneTap={false}
          theme="filled_black"
          size="large"
          text="continue_with"
          shape="pill"
          logo_alignment="left"
          locale="en"
          width="100%"
        />
      </div>

      {/* Sign Up Link */}
      <div className="relative mt-2 text-center">
        <p className="text-sm text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={handleSignup}
            className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors duration-300 hover:underline decoration-2 underline-offset-4"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
