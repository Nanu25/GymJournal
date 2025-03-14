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
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8218b762312d8e8d5411618962cac278c11ffd2d"
        className="absolute h-[279px] left-[1040px] right-[347px] top-[-17px] w-[279px] max-md:h-[200px] max-md:right-[50px] max-md:w-[200px] max-sm:top-2.5 max-sm:h-[150px] max-sm:w-[150px]"
        alt="Dumbbell icon"
      />
    </header>
  );
};

export default WelcomeHeader;
