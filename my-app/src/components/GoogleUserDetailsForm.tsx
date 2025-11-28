import React, { useState } from "react";
import { Scale, Ruler, Calendar, Users, Clock, Repeat, Calendar as CalendarIcon, Check } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

import { User } from "../types/index";

interface GoogleUserDetailsFormProps {
  onComplete: () => void;
  user: User;
}

interface UserDetails {
  weight?: number;
  height?: number;
  gender?: string;
  age?: number;
  timesPerWeek?: number;
  timePerSession?: number;
  repRange?: string;
}

const GoogleUserDetailsForm: React.FC<GoogleUserDetailsFormProps> = ({ onComplete, user }) => {
  const [formData, setFormData] = useState<UserDetails>({
    weight: undefined,
    height: undefined,
    gender: "",
    age: undefined,
    timesPerWeek: undefined,
    timePerSession: undefined,
    repRange: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? undefined : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Update user with additional details
      const response = await api.user.updateProfile({
        ...formData,
        // Convert string numbers to actual numbers
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        age: formData.age ? Number(formData.age) : undefined,
        timesPerWeek: formData.timesPerWeek ? Number(formData.timesPerWeek) : undefined,
        timePerSession: formData.timePerSession ? Number(formData.timePerSession) : undefined,
      });

      if (response.success) {
        // Update the auth context with the complete user data
        const token = localStorage.getItem('token');
        if (token) {
          // The API response structure for updateProfile might return the user object directly or wrapped
          // Based on the error, it seems to be wrapped or the type inference is confused.
          // If response.data contains the user fields directly, we cast it.
          // If the error says it has a 'user' property, we use that.
          // The previous error suggested response.data might be the login response type which has { user, token }.
          // Let's try to handle both or inspect the error more closely.
          // Error said: Type '{ user: ... } ...' is missing ...
          // So response.data HAS a user property.
          const updatedUser = (response.data as any).user || response.data;
          login(token, updatedUser as User);
        }
        onComplete();
      } else {
        setError(response.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-blue-200/70">
            Your Google account has been connected successfully.
            <br />
            Now let's set up your fitness profile to get started.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">
              Weight (kg)
            </label>
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
            <label className="block text-sm font-medium text-blue-200/90 mb-1">
              Height (cm)
            </label>
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
            <label className="block text-sm font-medium text-blue-200/90 mb-1">
              Age
            </label>
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
            <label className="block text-sm font-medium text-blue-200/90 mb-1">
              Gender
            </label>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-black/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-black-500 text-white pl-10"
              >
                <option value="" className="text-black">Select gender</option>
                <option value="Male" className="text-black">Male</option>
                <option value="Female" className="text-black">Female</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-blue-300/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-200/90 mb-1">
              Training Frequency (times/week)
            </label>
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
            <label className="block text-sm font-medium text-blue-200/90 mb-1">
              Time per Session (minutes)
            </label>
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-200/90 mb-1">
              Preferred Repetition Range
            </label>
            <div className="relative">
              <input
                type="text"
                name="repRange"
                value={formData.repRange || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white pl-10"
                placeholder="e.g. 8-12, 12-15, 15-20"
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
          className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:outline-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="h-5 w-5" />
          {isSubmitting ? 'Completing Setup...' : 'Complete Profile Setup'}
        </button>

        <div className="text-center mt-4">
          <p className="text-blue-200/70 text-sm">
            You can skip any field and update it later in your profile settings.
          </p>
        </div>
      </form>
    </div>
  );
};

export default GoogleUserDetailsForm;
