"use client";

import React from "react";

interface WelcomeHeaderProps {
  username: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ username }) => {
  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white text-center sm:text-left">
      <span>Welcome back, </span>
      <span className="text-blue-400">{username}</span>
    </h1>
  );
};

export default WelcomeHeader;