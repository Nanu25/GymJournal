"use client";

import React from "react";

interface WelcomeHeaderProps {
  username: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ username }) => {
  return (
    <h1 className="text-6xl font-semibold text-white max-md:text-5xl max-sm:text-4xl">
      <span>Welcome back, </span>
      <span className="text-blue-400">{username}</span>
    </h1>
  );
};

export default WelcomeHeader; 