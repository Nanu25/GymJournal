import React from 'react';

interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const NeoInput: React.FC<NeoInputProps> = ({
    label,
    error,
    icon,
    className = '',
    id,
    ...props
}) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label htmlFor={id} className="text-sm font-medium text-slate-300 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    className={`
                        w-full bg-white/5 border border-white/10 rounded-xl 
                        ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3
                        text-white placeholder:text-slate-500
                        focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 focus:bg-white/10
                        transition-all duration-300
                        ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-400 ml-1">{error}</p>
            )}
        </div>
    );
};
