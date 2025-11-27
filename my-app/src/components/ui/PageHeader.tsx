import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-slate-400 text-lg">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && (
                <div className="flex-shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
};
