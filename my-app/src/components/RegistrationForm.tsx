"use client";
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
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-blue-200/90 mb-1"> Name <span className="text-red-500">*</span></label>
          <div className="relative">
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
              placeholder="Your name"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-blue-300/50" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-200/90 mb-1"> Email<span className="text-red-500">*</span></label>
          <div className="relative">
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
              placeholder="your@email.com"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-blue-200/90 mb-1"> Password <span className="text-red-500">*</span></label>
          <div className="relative">
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
              placeholder="••••••••"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-200/90 mb-1">Confirm Password</label>
          <div className="relative">
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
              placeholder="••••••••"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Weight (kg)</label>
            <div className="relative">
              <input 
                type="number"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="e.g. 75"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Scale className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Height (cm)</label>
            <div className="relative">
              <input 
                type="number"
                name="height"
                value={formData.height || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="e.g. 180"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ruler className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Age</label>
            <div className="relative">
              <input 
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="e.g. 25"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Gender</label>
            <div className="relative">
              <input 
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="e.g. Male/Female"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Training Frequency (times/week)</label>
            <div className="relative">
              <input 
                type="number"
                name="timesPerWeek"
                value={formData.timesPerWeek || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="e.g. 3"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Time per Session (minutes)</label>
            <div className="relative">
              <input 
                type="number"
                name="timePerSession"
                value={formData.timePerSession || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="e.g. 60"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Repetition Range</label>
            <div className="relative">
              <input 
                type="text"
                name="repRange"
                value={formData.repRange}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="e.g. 8-12"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Repeat className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="h-5 w-5" />
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="text-center mt-4">
          <p className="text-blue-200/70 text-sm">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={onNavigateToLogin}
              className="text-blue-400 hover:text-blue-300"
            >
              Sign in
            </button>
          </p>
          <p className="text-xs text-red-400 mt-2">* indicates a mandatory field</p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;