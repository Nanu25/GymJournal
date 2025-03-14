"use client";

import React from "react";

const TrainingSession: React.FC<TrainingSessionProps> = ({ text }) => {
  return (
    <div className="mt-5 mr-0 mb-0 ml-10 text-2xl text-white max-sm:text-xl">
      {text}
    </div>
  );
};

export default TrainingSession;
