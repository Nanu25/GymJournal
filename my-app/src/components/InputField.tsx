import React from "react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  value,
  onChange,
  className = '',
}: InputFieldProps) => {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-5 py-3 text-xl md:text-4xl text-black opacity-80 bg-zinc-300 border-none h-14 md:h-[68px] w-full rounded-sm ${className}`}
      />
    </div>
  );
};

export default InputField;
