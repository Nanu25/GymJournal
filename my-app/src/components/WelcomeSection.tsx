import React from 'react';

const WelcomeSection = () => {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-3">
        Welcome to your personal gym journal
      </h1>
      <div className="flex items-center gap-2">
        <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        <p className="text-lg text-blue-200/70">A smarter way to track your gym progress—because every rep counts!</p>
      </div>
    </div>
  );
};

export default WelcomeSection;
