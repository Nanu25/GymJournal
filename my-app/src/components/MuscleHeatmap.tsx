import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { bodyFront, bodyBack, bodyFemaleFront, bodyFemaleBack, BodyPart } from './BodyHeatmapAssets';

interface MuscleHeatmapProps {
    recentMuscleGroups: string[];
    gender?: string;
}

const MuscleHeatmap: React.FC<MuscleHeatmapProps> = ({ recentMuscleGroups, gender = 'male' }) => {
    const [view, setView] = useState<'front' | 'back'>('front');
    const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

    // Map broad muscle categories to specific SVG slugs
    const muscleMapping: Record<string, string[]> = {
        'Chest': ['chest'],
        'Back': ['upper-back', 'lats', 'lower-back', 'trapezius'],
        'Shoulders': ['shoulders', 'deltoids'],
        'Arms': ['biceps', 'triceps', 'forearms', 'arms'],
        'Abs': ['abs', 'obliques'],
        'Legs': ['legs', 'hamstring', 'calves', 'quadriceps', 'adductors'],
        'Glutes': ['glutes', 'hip', 'gluteal'],
        'Cardio': [] // SOON
    };

    const getActiveSlugs = () => {
        const activeSlugs: string[] = [];
        recentMuscleGroups.forEach(group => {
            if (muscleMapping[group]) {
                activeSlugs.push(...muscleMapping[group]);
            } else {
                // Try direct match (case insensitive)
                activeSlugs.push(group.toLowerCase());
            }
        });
        return activeSlugs;
    };

    const activeSlugs = getActiveSlugs();

    const isActive = (slug: string) => activeSlugs.includes(slug);

    const getFill = (slug: string) => {
        const active = isActive(slug);
        const hovered = hoveredMuscle === slug;

        if (active) {
            return hovered ? '#f87171' : '#ef4444'; // Lighter red on hover
        }
        return hovered ? '#475569' : '#334155'; // Lighter slate on hover
    };

    const handleMouseEnter = (muscle: string) => setHoveredMuscle(muscle);
    const handleMouseLeave = () => setHoveredMuscle(null);

    const renderBodyPart = (part: BodyPart, index: number) => {
        const active = isActive(part.slug);

        return (
            <g
                key={`${part.slug}-${index}`}
                onMouseEnter={() => handleMouseEnter(part.slug)}
                onMouseLeave={handleMouseLeave}
                className="transition-opacity duration-200 cursor-pointer"
            >
                {part.pathArray.map((path, pathIndex) => (
                    <path
                        key={pathIndex}
                        d={path}
                        fill={getFill(part.slug)}
                        stroke={active ? "rgba(255,255,255,0.1)" : "none"}
                        strokeWidth="0.5"
                        className="transition-colors duration-300"
                    />
                ))}
            </g>
        );
    };

    // Select appropriate body data based on gender
    // Default to male if gender is not explicitly female
    const isFemale = gender?.toLowerCase() === 'female';
    const currentBodyFront = isFemale ? bodyFemaleFront : bodyFront;
    const currentBodyBack = isFemale ? bodyFemaleBack : bodyBack;

    const currentData = view === 'front' ? currentBodyFront : currentBodyBack;

    // The new assets from react-body-highlighter use a 0-100 x 0-200 coordinate system
    const viewBox = "0 0 100 200";

    return (
        <GlassCard className="flex flex-col items-center p-4 relative h-auto w-full max-w-[300px]">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                    onClick={() => setView(v => v === 'front' ? 'back' : 'front')}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                    {view === 'front' ? <ChevronRight className="text-white" /> : <ChevronLeft className="text-white" />}
                </button>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Recovery Status</h3>
            <p className="text-xs text-gray-400 mb-4 h-4 font-medium text-blue-400 capitalize">
                {hoveredMuscle ? hoveredMuscle.replace('-', ' ') : (view === 'front' ? 'Front View' : 'Back View')}
            </p>

            <div className="relative h-[220px] w-full flex justify-center">
                <svg
                    viewBox={viewBox}
                    className="h-full w-auto drop-shadow-xl"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {currentData.map((part, index) => renderBodyPart(part, index))}
                </svg>
            </div>

            <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                    <span className="text-xs text-gray-400">Recovering</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#334155]"></div>
                    <span className="text-xs text-gray-400">Ready</span>
                </div>
            </div>
        </GlassCard>
    );
};

export default MuscleHeatmap;
