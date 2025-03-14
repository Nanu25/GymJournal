"use client";
import React, { useState } from "react";
import InputField from "./InputField";
import MetricField from "./MetricField";

interface RegistrationFormProps {
  onNavigateToLogin: () => void;
}

const RegistrationForm = ({ onNavigateToLogin }: RegistrationFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Registration form submitted");
  };

  return (
    <section className="px-4 md:px-10 mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-7 max-w-md">
        <InputField
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <InputField
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="flex gap-6 mt-2.5">
          <MetricField
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <MetricField
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div className="flex gap-6 mt-2.5">
          <MetricField
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <MetricField
            placeholder="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="mt-10 text-2xl md:text-4xl text-white cursor-pointer bg-gray-950 border-none h-12 md:h-[47px] w-full md:w-[180px]"
        >
          Create
        </button>

        <div className="mt-4 text-white text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-blue-300 underline cursor-pointer"
          >
            Login here
          </button>
        </div>
      </form>
    </section>
  );
};

export default RegistrationForm;
