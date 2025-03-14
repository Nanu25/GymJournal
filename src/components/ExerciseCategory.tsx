import React from "react";
import ExerciseButton from "./ExerciseButton";

interface ExerciseCategoryProps {
  name: string;
  exercises: string[];
}

const ExerciseCategory: React.FC<ExerciseCategoryProps> = ({
  name,
  exercises,
}) => {
  return (
    <section className="flex flex-col gap-2.5 w-full">
      <h2 className="text-3xl text-white max-sm:text-2xl">{name}</h2>
      <div className="flex justify-between mx-0 my-5 w-full gap-8 max-md:flex-col max-md:gap-8 max-md:items-center">
        {exercises.map((exercise, index) => (
          <ExerciseButton key={index} name={exercise} />
        ))}
      </div>
    </section>
  );
};

export default ExerciseCategory;
