import React from "react";

interface ExerciseButtonProps {
  name: string;
}

const ExerciseButton: React.FC<ExerciseButtonProps> = ({ name }) => {
  return (
    <div className="flex flex-col gap-3 items-center">
      <input
        type="text"
        value={name}
        readOnly
        className="rounded border border-gray-300 bg-zinc-600 opacity-30 px-3 text-center text-black h-[39px] w-[102px] max-md:w-4/5 max-sm:text-sm max-sm:h-[35px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={name}
      />
      <p className="text-base text-center text-white max-sm:text-sm">{name}</p>
    </div>
  );
};

export default ExerciseButton;
