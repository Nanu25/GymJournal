import React from "react";

const DividerLine: React.FC = () => {
  return (
    <div className="flex justify-center mb-8">
      <svg
        width="510"
        height="10"
        viewBox="0 0 510 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="line"
      >
        <path
          d="M0 6.59656L5.02023 9.44798L4.97952 3.67462L0 6.59656ZM510.005 3.00002L504.985 0.148598L505.026 5.92196L510.005 3.00002ZM4.50341 7.06481L505.509 3.53174L505.502 2.53176L4.49636 6.06484L4.50341 7.06481Z"
          fill="#3223D9"
        />
      </svg>
    </div>
  );
};

export default DividerLine;
