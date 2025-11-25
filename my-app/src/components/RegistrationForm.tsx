import React, { useState } from "react";
import { UserPlus, Scale, Ruler, Calendar, Users, Clock, Repeat, Calendar as CalendarIcon, User } from "lucide-react";
import WelcomeSection from "./WelcomeSection";
import { api, UserData } from "../services/api";

interface RegistrationFormProps {
  onNavigateToLogin: () => void;
}

const RegistrationForm = ({ onNavigateToLogin }: RegistrationFormProps) => {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
    weight: undefined,
    height: undefined,
    gender: "",
    age: undefined,
    timesPerWeek: undefined,
    timePerSession: undefined,
    repRange: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.auth.register(formData);
      if (response.success) {
        // Handle successful registration (e.g., redirect to login)
        onNavigateToLogin();
      } else {
        setError(response.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <WelcomeSection />
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-2xl backdrop-blur-md">
            {error}
          </div>
        )}

        {/* Name Input */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative">
            <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-14 px-6 text-lg text-white bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 placeholder:text-white/20 pl-12"
                placeholder="Your name"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-6 w-6 text-blue-400/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Email Input */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative">
            <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Email <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-14 px-6 text-lg text-white bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 placeholder:text-white/20 pl-12"
                placeholder="your@email.com"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Password Input */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative">
            <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-14 px-6 text-lg text-white bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 placeholder:text-white/20 pl-12"
                placeholder="••••••••"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative">
            <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Confirm Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-14 px-6 text-lg text-white bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 placeholder:text-white/20 pl-12"
                placeholder="••••••••"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weight */}
          <div className="group relative">
            <div className="relative">
              <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="e.g. 75"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Scale className="h-5 w-5 text-blue-400/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Height */}
          <div className="group relative">
            <div className="relative">
              <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Height (cm)</label>
              <div className="relative">
                <input
                  type="number"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="e.g. 180"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-5 w-5 text-blue-400/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Age */}
          <div className="group relative">
            <div className="relative">
              <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Age</label>
              <div className="relative">
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="e.g. 25"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-blue-400/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Gender */}
          <div className="group relative">
            <div className="relative">
              <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Gender</label>
              <div className="relative">
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="e.g. Male/Female"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-blue-400/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="group relative">
            <div className="relative">
              <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Training Frequency (times/week)</label>
              <div className="relative">
                <input
                  type="number"
                  name="timesPerWeek"
                  value={formData.timesPerWeek || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="e.g. 3"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-blue-400/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Time per Session */}
          <div className="group relative">
            <div className="relative">
              <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Time per Session (minutes)</label>
              <div className="relative">
                <input
                  type="number"
                  name="timePerSession"
                  value={formData.timePerSession || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="e.g. 60"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-blue-400/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Rep Range */}
          <div className="group relative md:col-span-2">
            <div className="relative">
              <label className="block text-sm font-medium text-blue-200/90 mb-2 ml-1">Repetition Range</label>
              <div className="relative">
                <input
                  type="text"
                  name="repRange"
                  value={formData.repRange}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="e.g. 8-12"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Repeat className="h-5 w-5 text-blue-400/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="group relative mt-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-gradient-x"></div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full h-16 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200 shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
              <UserPlus className="h-6 w-6" />
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
            </span>
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-lg text-white/60">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors duration-300 hover:underline decoration-2 underline-offset-4"
            >
              Sign in
            </button>
          </p>
          <p className="text-xs text-red-400/80 mt-3">* indicates a mandatory field</p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;