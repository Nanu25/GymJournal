import { useState, useMemo } from 'react';
import { useTrainings, useTrainingMutations } from './useTrainings';


export type SortField = "date" | "pr" | "exercises" | null;
export type SortDirection = "asc" | "desc";



export const useTrainingData = () => {
    // TanStack Query Hooks
    const { data: trainingsData = [], isLoading, error } = useTrainings();
    const { deleteTraining: deleteMutation, updateTraining: updateMutation } = useTrainingMutations();

    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");


    // Filtering & Sorting Logic
    const filteredAndSortedTrainings = useMemo(() => {
        let result = [...trainingsData];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(training =>
                training.date.includes(term) ||
                Object.keys(training.exercises).some(exercise => exercise.toLowerCase().includes(term))
            );
        }

        // Apply sorting
        if (sortField === "date") {
            result.sort((a, b) => {
                const comparison = a.date.localeCompare(b.date);
                return sortDirection === "asc" ? comparison : -comparison;
            });
        } else if (sortField === "pr") {
            result.sort((a, b) => {
                const prA = Object.values(a.exercises).length > 0 ? Math.max(...Object.values(a.exercises).map(Number)) : 0;
                const prB = Object.values(b.exercises).length > 0 ? Math.max(...Object.values(b.exercises).map(Number)) : 0;
                return sortDirection === "asc" ? prA - prB : prB - prA;
            });
        } else if (sortField === "exercises") {
            result.sort((a, b) => {
                const countA = Object.keys(a.exercises).length;
                const countB = Object.keys(b.exercises).length;
                return sortDirection === "asc" ? countA - countB : countB - countA;
            });
        }

        return result;
    }, [trainingsData, searchTerm, sortField, sortDirection]);

    // Calculate Stats
    const exerciseStats = useMemo(() => {
        if (filteredAndSortedTrainings.length > 0) {
            const exerciseCounts = filteredAndSortedTrainings.map(t => Object.keys(t.exercises).length);
            return {
                min: Math.min(...exerciseCounts),
                max: Math.max(...exerciseCounts),
                avg: Math.round(exerciseCounts.reduce((a, b) => a + b, 0) / exerciseCounts.length)
            };
        }
        return { max: 0, min: 0, avg: 0 };
    }, [filteredAndSortedTrainings]);

    // Handlers
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const deleteTraining = async (date: string) => {
        await deleteMutation.mutateAsync(date);
    };

    const updateTraining = async (originalDate: string, newDate: string, exercises: Record<string, number>) => {
        await updateMutation.mutateAsync({ date: originalDate, data: { date: newDate, exercises } });
    };

    return {
        trainings: filteredAndSortedTrainings,
        isLoading,
        error: error ? (error as Error).message : null,
        searchTerm,
        setSearchTerm,
        sortField,
        sortDirection,
        handleSort,
        exerciseStats,
        deleteTraining,
        updateTraining,
        refreshTrainings: () => { } // No-op, query handles this
    };
};
