import React from "react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-5 py-3 text-xl md:text-4xl text-black opacity-80 bg-zinc-300 border-none h-14 md:h-[68px] w-full rounded-sm"
      />
    </div>
  );
};

export default InputField;
