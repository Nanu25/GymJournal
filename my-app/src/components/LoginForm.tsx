import React, { useState } from "react";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onNavigateToRegistration: () => void; // New prop for navigation
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onNavigateToRegistration,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Login functionality would be implemented here
    console.log("Login button clicked", { email, password });
    onLoginSuccess();
  };

  const handleSignup = () => {
    // Navigate to registration page
    onNavigateToRegistration();
  };

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 mb-16">
      <div className="flex flex-col gap-5 max-w-[386px] mx-auto md:mx-0">
        <div className="flex items-center bg-zinc-300 border-[none] h-[67px] w-full">
          <input
            type="email"
            placeholder="Email..."
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-5 py-0 text-2xl md:text-3xl lg:text-4xl text-black opacity-50 border-[none] size-full"
          />
        </div>
        <div className="flex items-center bg-zinc-300 border-[none] h-[67px] w-full">
          <input
            type="password"
            placeholder="Password..."
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-5 py-0 text-2xl md:text-3xl lg:text-4xl text-black opacity-50 border-[none] size-full"
          />
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="mt-5 text-2xl md:text-3xl lg:text-4xl text-black cursor-pointer bg-gray-950 border-[none] h-[54px] w-[180px]"
        >
          Login
        </button>
        <p className="mt-5 text-lg md:text-xl text-black">
          <span>If you don't have an account, click </span>
          <button
            type="button"
            onClick={handleSignup}
            className="text-red-600 cursor-pointer"
            id="signup-button"
          >
            here to sing in
          </button>
        </p>
      </div>
    </section>
  );
};

export default LoginForm;
