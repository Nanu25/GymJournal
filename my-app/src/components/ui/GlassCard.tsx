import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    hoverEffect = false
}) => {
    return (
        <div
            className={`
                glass-card rounded-3xl p-6 md:p-8 
                ${hoverEffect ? 'transition-all duration-300 hover:bg-white/10 hover:scale-[1.01] hover:shadow-emerald-500/10' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};
