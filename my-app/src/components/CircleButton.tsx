"use client";

import React from "react";

interface CircleButtonProps {
  svgContent: string;
  onClick?: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({ svgContent, onClick }) => {
  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      <div>
        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      </div>
    </div>
  );
};

export default CircleButton;
