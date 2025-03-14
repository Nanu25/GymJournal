"use client";

import React from "react";
import CrownIcon from "./icons/CrownIcon";

const PRSection: React.FC = () => {
  return (
    <aside className="mt-48 mx-auto max-md:mt-28">
      <CrownIcon />

      <div className="p-5 opacity-70 bg-red-950 h-[269px] pr-[container] w-[270px]">
        <h3 className="mt-3.5 text-3xl text-center text-white pr-[text]">PR</h3>
        <select className="mx-auto mt-5 mb-0 h-8 text-2xl text-white opacity-50 bg-slate-500 w-[230px]">
          <option>Select muscle group</option>
        </select>
      </div>
    </aside>
  );
};

export default PRSection;
