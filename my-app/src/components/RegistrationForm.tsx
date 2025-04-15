"use client";
import React, { useState } from "react";
import { ChevronRight, UserPlus, Scale, Ruler, Calendar, Users, Clock, Repeat, Calendar as CalendarIcon, User } from "lucide-react";
import WelcomeSection from "./WelcomeSection";

interface RegistrationFormProps {
  onNavigateToLogin: () => void;
}

const RegistrationForm = ({ onNavigateToLogin }: RegistrationFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [timesPerWeek, setTimesPerWeek] = useState("");
  const [timePerSession, setTimePerSession] = useState("");
  const [repRange, setRepRange] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration form submitted");
  };

  return (
    <>
      <WelcomeSection />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-blue-200/90 mb-1">Name</label>
          <div className="relative">
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <label className="block text-sm font-medium text-blue-200/90 mb-1">Email</label>
          <div className="relative">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <label className="block text-sm font-medium text-blue-200/90 mb-1">Password</label>
          <div className="relative">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Weight</label>
            <div className="relative">
              <input 
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="kg"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Scale className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Height</label>
            <div className="relative">
              <input 
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="cm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ruler className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Age</label>
            <div className="relative">
              <input 
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="years"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">Gender</label>
            <div className="relative">
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10 appearance-none"
              >
                <option value="" disabled selected className="bg-slate-800">Select gender</option>
                <option value="male" className="bg-slate-800">Male</option>
                <option value="female" className="bg-slate-800">Female</option>
                <option value="other" className="bg-slate-800">Other</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-blue-300/50" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronRight className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-blue-200/90 mb-4">Training Preferences</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-200/90 mb-1">Times/Week</label>
              <div className="relative">
                <input 
                  type="number"
                  value={timesPerWeek}
                  onChange={(e) => setTimesPerWeek(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                  placeholder="times"
                  min="1"
                  max="7"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-blue-300/50" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200/90 mb-1">Time/Session</label>
              <div className="relative">
                <input 
                  type="number"
                  value={timePerSession}
                  onChange={(e) => setTimePerSession(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                  placeholder="minutes"
                  min="1"
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
                  value={repRange}
                  onChange={(e) => setRepRange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                  placeholder="e.g. 8-12"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Repeat className="h-5 w-5 text-blue-300/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          Create Account
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
        </div>
      </form>
    </>
  );
};

export default RegistrationForm;