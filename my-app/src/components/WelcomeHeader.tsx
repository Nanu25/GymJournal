"use client";

import React from "react";

interface WelcomeHeaderProps {
  username: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ username }) => {
  return (
    <header className="relative">
      <h1 className="relative mt-3.5 mr-0 mb-0 ml-28 text-6xl font-semibold text-white max-md:ml-12 max-md:text-5xl max-sm:ml-5 max-sm:text-4xl">
        <span>Welcome back</span>
        <br />
        <span>{username}</span>
      </h1>
  
    </header>
  );
};

export default WelcomeHeader;
