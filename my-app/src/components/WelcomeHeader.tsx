"use client";

import React from "react";

interface WelcomeHeaderProps {
  username: string;
  onLogout: () => void;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ username, onLogout }) => {
  return (
    <header className="relative">
      <h1 className="relative mt-3.5 mr-0 mb-0 ml-28 text-6xl font-semibold text-white max-md:ml-12 max-md:text-5xl max-sm:ml-5 max-sm:text-4xl">
        <span>Welcome back, </span>
        <span className="text-blue-400">{username}</span>
      </h1>
      <button
        onClick={onLogout}
        className="px-6 py-3 text-lg text-blue-200 bg-[#1a2234] rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-200"
      >
        Logout
      </button>
    </header>
  );
};

export default WelcomeHeader;
