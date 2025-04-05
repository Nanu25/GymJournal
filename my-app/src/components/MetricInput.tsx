import React from "react";

interface MetricInputProps {
    label: string;
    value: string; // Controlled value from the parent
    onChange: (label: string, value: string) => void; // Reports raw string value
    placeholder?: string;
    textColor?: string;
}

const MetricInput: React.FC<MetricInputProps> = ({
                                                     label,
                                                     value,
                                                     onChange,
                                                     placeholder = "",
                                                     textColor = "text-black",
                                                 }) => {
    // Check if the label contains a newline character
    const hasMultipleLines = label.includes("\n");
    const labelLines = hasMultipleLines ? label.split("\n") : [label];

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(label, e.target.value); // Pass the raw string value to the parent
    };

    return (
        <div className="flex flex-col gap-3 items-center">
            <input
                type="text" // Consider "number" if only numeric input is desired
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="rounded border border-gray-300 bg-white px-3 text-center h-[39px] w-[102px] max-sm:w-20 max-sm:h-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={label}
            />
            <p className={`text-base text-center ${textColor} max-sm:text-sm`}>
                {labelLines.map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        {index < labelLines.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </p>
        </div>
    );
};

export default MetricInput;