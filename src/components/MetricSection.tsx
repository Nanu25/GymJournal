import React from "react";
import MetricInput from "./MetricInput";

interface MetricItem {
    label: string;
    placeholder?: string;
    // Allow additional properties (e.g., value, onChange)
    [key: string]: any;
}

interface MetricSectionProps {
    title: string;
    metrics: MetricItem[];
    className?: string;
    textColor?: string;
}

const MetricSection: React.FC<MetricSectionProps> = ({
                                                         title,
                                                         metrics,
                                                         className = "",
                                                         textColor = "text-black",
                                                     }) => {
    return (
        <section className={className}>
            <h2 className={`mx-0 my-5 text-3xl text-center ${textColor} max-sm:text-2xl`}>
                {title}
            </h2>
            <div className="flex justify-between mx-0 my-5 w-full max-w-[510px] gap-8 max-md:flex-col max-md:gap-8 max-md:items-center">
                {metrics.map((metric, index) => (
                    <MetricInput
                        key={index}
                        label={metric.label}
                        placeholder={metric.placeholder}
                        textColor={textColor}
                        {...metric} // spread any extra props (like value and onChange)
                    />
                ))}
            </div>
        </section>
    );
};

export default MetricSection;
