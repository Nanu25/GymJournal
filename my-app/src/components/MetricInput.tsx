import React, { useState, useEffect } from "react";

interface MetricInputProps {
    label: string;
    placeholder?: string;
    textColor?: string;
    value?: string | number; // New prop to control the input value
    onChange?: (label: string, value: number) => void;
}

const MetricInput: React.FC<MetricInputProps> = ({
                                                     label,
                                                     placeholder = "",
                                                     textColor = "text-black",
                                                     value: externalValue,
                                                     onChange, // Add the onChange prop
                                                 }) => {
    const [internalValue, setInternalValue] = useState(externalValue !== undefined
        ? String(externalValue)
        : "");

    // Update internal state when external value changes
    useEffect(() => {
        if (externalValue !== undefined) {
            setInternalValue(String(externalValue));
        }
    }, [externalValue]);

    // Check if the label contains a newline character
    const hasMultipleLines = label.includes("\n");
    const labelLines = hasMultipleLines ? label.split("\n") : [label];

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);

        // Report change to parent component if onChange is provided
        if (onChange) {
            // Convert to number or 0 if empty
            const numericValue = newValue === "" ? 0 : Number(newValue);
            onChange(label, numericValue);
        }
    };

    return (
        <div className="flex flex-col gap-3 items-center">
            <input
                type="text"
                value={internalValue}
                onChange={handleChange} // Use the new handler
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