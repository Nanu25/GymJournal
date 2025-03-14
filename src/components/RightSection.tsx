import React from "react";

const RightSection: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center px-4 relative py-10">
      <div className="flex flex-col items-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7ecaa88fc905e6bf7a48ff6f90ceca5c5b4e3994"
          alt="Gym icon"
          className="h-[150px] w-[150px] md:h-[250px] md:w-[250px] lg:h-[312px] lg:w-[312px]"
        />
      </div>

      <div className="mt-8 md:mt-16 lg:mt-24 relative">
        {/* Line */}
        <svg
          width="503"
          height="6"
          viewBox="0 0 503 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full mb-8"
        >
          <path
            d="M0.113249 3L3 5.88675L5.88675 3L3 0.113249L0.113249 3ZM3 3.5H503V2.5H3V3.5Z"
            fill="white"
          ></path>
        </svg>

        {/* Circle with text inside */}
        <div className="relative">
          {/* Circle background */}
          <svg
            width="465"
            height="299"
            viewBox="0 0 465 299"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <ellipse
              opacity="0.1"
              cx="232.5"
              cy="149.5"
              rx="232.5"
              ry="149.5"
              fill="#D9D9D9"
            ></ellipse>
          </svg>

          {/* Text positioned inside the circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4">
            <p className="text-xl md:text-3xl lg:text-4xl text-center text-black max-w-xs md:max-w-sm mx-auto">
              A smarter way to track your gym progress—because every rep counts!
            </p>
          </div>
        </div>
      </div>

      {/* Add extra space at the bottom to ensure scrollability */}
      <div className="h-20 md:h-40"></div>
    </section>
  );
};

export default RightSection;
