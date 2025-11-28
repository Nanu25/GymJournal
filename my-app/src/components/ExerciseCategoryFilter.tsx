import React from 'react';

interface ExerciseCategory {
    category: string;
    exercises: string[];
}

interface ExerciseCategoryFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    categories: ExerciseCategory[];
    activeCategory: string;
    setActiveCategory: (category: string) => void;
}

const ExerciseCategoryFilter: React.FC<ExerciseCategoryFilterProps> = ({
    searchTerm,
    setSearchTerm,
    categories,
    activeCategory,
    setActiveCategory
}) => {
    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for an exercise..."
                    className="w-full pl-12 pr-4 py-4 text-lg border border-blue-500/10 rounded-xl bg-[#1a2234] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 placeholder-blue-200/30"
                />
            </div>

            {!searchTerm && (
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.category}
                            onClick={() => setActiveCategory(category.category)}
                            className={`px-4 py-2 rounded-xl text-lg transition-all duration-200 ${activeCategory === category.category
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "bg-[#1a2234] text-blue-200 border border-blue-500/10 hover:border-blue-500/30"
                                }`}
                        >
                            {category.category}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExerciseCategoryFilter;
