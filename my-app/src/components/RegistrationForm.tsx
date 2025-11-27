import React, { useState, useEffect } from "react";
import { Scale, User, Mail, Lock, AlertCircle, Check, X, Ruler, Calendar, Users, Calendar as CalendarIcon, Clock, Repeat, Loader2, UserPlus } from "lucide-react";

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
  const [shake, setShake] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(formData.password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [formData.password, confirmPassword]);

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

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
      setShake(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.auth.register(formData);
      if (response.success) {
        onNavigateToLogin();
      } else {
        setError(response.error || "Registration failed");
        setShake(true);
      }
    } catch (err) {
      setError("An error occurred during registration");
      setShake(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-8 transition-all duration-300 ${shake ? 'animate-shake' : ''}`}>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl backdrop-blur-md flex items-center gap-3 animate-fade-in-up">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Section: Account Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-white/10">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white/90">Account Details</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Name Input */}
            <div className="group relative">
              <div className="relative">
                <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 px-4 text-base text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 placeholder:text-white/20 pl-11"
                    placeholder="John Doe"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-400/50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="group relative">
              <div className="relative">
                <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-12 px-4 text-base text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 placeholder:text-white/20 pl-11"
                    placeholder="john@example.com"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-400/50" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Input */}
              <div className="group relative">
                <div className="relative">
                  <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full h-12 px-4 text-base text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 placeholder:text-white/20 pl-11"
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-400/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="group relative">
                <div className="relative">
                  <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full h-12 px-4 text-base text-white bg-[#0f172a]/60 backdrop-blur-xl border rounded-xl focus:ring-4 transition-all duration-300 placeholder:text-white/20 pl-11 pr-10
                        ${!passwordsMatch ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/10'}
                      `}
                      placeholder="••••••••"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${!passwordsMatch ? 'text-red-400/50' : 'text-purple-400/50'}`} />
                    </div>
                    {confirmPassword && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {passwordsMatch ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Physical Stats */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-white/10">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Scale className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white/90">Physical Stats</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Weight */}
            <div className="group relative">
              <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="75"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Scale className="h-4 w-4 text-blue-400/50" />
                </div>
              </div>
            </div>

            {/* Height */}
            <div className="group relative">
              <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">Height (cm)</label>
              <div className="relative">
                <input
                  type="number"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="180"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Ruler className="h-4 w-4 text-blue-400/50" />
                </div>
              </div>
            </div>

            {/* Age */}
            <div className="group relative">
              <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">Age</label>
              <div className="relative">
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="25"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-blue-400/50" />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="group relative">
              <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">Gender</label>
              <div className="relative">
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="M/F"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-4 w-4 text-blue-400/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Training Preferences */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-white/10">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <CalendarIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white/90">Training Goals</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Frequency */}
            <div className="group relative">
              <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">Frequency (per week)</label>
              <div className="relative">
                <input
                  type="number"
                  name="timesPerWeek"
                  value={formData.timesPerWeek || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="3"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-4 w-4 text-blue-400/50" />
                </div>
              </div>
            </div>

            {/* Time per Session */}
            <div className="group relative">
              <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">Duration (mins)</label>
              <div className="relative">
                <input
                  type="number"
                  name="timePerSession"
                  value={formData.timePerSession || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="60"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-blue-400/50" />
                </div>
              </div>
            </div>

            {/* Rep Range */}
            <div className="group relative">
              <label className="block text-xs font-medium text-blue-200/70 mb-1.5 ml-1 uppercase tracking-wider">Rep Range</label>
              <div className="relative">
                <input
                  type="text"
                  name="repRange"
                  value={formData.repRange}
                  onChange={handleChange}
                  className="w-full h-12 px-4 text-white bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 pl-10"
                  placeholder="8-12"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Repeat className="h-4 w-4 text-blue-400/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="group relative mt-8 pt-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 animate-gradient-x"></div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full h-14 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200 shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </span>
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-base text-white/60">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors duration-300 hover:underline decoration-2 underline-offset-4"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;