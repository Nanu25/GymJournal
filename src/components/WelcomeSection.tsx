import React from "react";

const WelcomeSection: React.FC = () => {
  return (
    <section className="w-full px-4 md:px-8 lg:px-12 mb-8">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-100 mt-8 md:mt-12 max-w-[507px] mx-auto md:mx-0">
        Welcome to your personal gym journal
      </h1>
      <div className="relative mt-12 w-full max-w-[554px]">
        <svg
          width="557"
          height="6"
          viewBox="0 0 557 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M556.887 3L554 0.113249L551.113 3L554 5.88675L556.887 3ZM0 3.5H554V2.5H0L0 3.5Z"
            fill="#D9D9D9"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default WelcomeSection;
