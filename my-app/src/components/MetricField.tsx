import React from "react";

interface MetricFieldProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MetricField = ({ placeholder, value, onChange }: MetricFieldProps) => {
  return (
    <div className="flex-1">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-2.5 py-2 h-10 md:h-12 text-xl md:text-4xl text-black opacity-80 bg-zinc-300 border-none w-full rounded-sm"
      />
    </div>
  );
};

export default MetricField;
