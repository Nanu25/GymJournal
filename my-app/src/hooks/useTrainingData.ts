import { useState, useEffect, useMemo, useCallback } from 'react';
import { trainingService, TrainingEntry } from '../services/trainingService';
import toast from 'react-hot-toast';

export type SortField = "date" | "pr" | "exercises" | null;
export type SortDirection = "asc" | "desc";

interface ExerciseStats {
    max: number;
    min: number;
    avg: number;
}

export const useTrainingData = () => {
    // Data State
    const [trainings, setTrainings] = useState<TrainingEntry[]>(() => {
        return trainingService.getCachedTrainings();
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [exerciseStats, setExerciseStats] = useState<ExerciseStats>({ max: 0, min: 0, avg: 0 });

    // Fetch Trainings
    const fetchTrainings = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await trainingService.getAllTrainings();
            setTrainings(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching trainings:", err);
            setError("Failed to load training history");
            // Fallback to cache if fetch fails is already handled by initial state, 
            // but we might want to keep showing cached data if we have it.
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial Fetch
    useEffect(() => {
        fetchTrainings();
    }, [fetchTrainings]);

    // Filtering & Sorting Logic
    const filteredAndSortedTrainings = useMemo(() => {
        let result = [...trainings];

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
    }, [trainings, searchTerm, sortField, sortDirection]);

    // Calculate Stats
    useEffect(() => {
        if (filteredAndSortedTrainings.length > 0) {
            const exerciseCounts = filteredAndSortedTrainings.map(t => Object.keys(t.exercises).length);
            const stats = {
                min: Math.min(...exerciseCounts),
                max: Math.max(...exerciseCounts),
                avg: Math.round(exerciseCounts.reduce((a, b) => a + b, 0) / exerciseCounts.length)
            };
            setExerciseStats(stats);
        } else {
            setExerciseStats({ max: 0, min: 0, avg: 0 });
        }
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
        try {
            await trainingService.deleteTraining(date);
            setTrainings(prev => {
                const updated = prev.filter(t => t.date !== date);
                trainingService.cacheTrainings(updated);
                return updated;
            });
            toast.success('Training deleted successfully');
        } catch (error) {
            console.error('Error deleting training:', error);
            toast.error(`Failed to delete training: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };

    const updateTraining = async (date: string, exercises: Record<string, number>) => {
        try {
            await trainingService.updateTraining(date, { date, exercises });
            setTrainings(prev => {
                const updated = prev.map(t => {
                    if (t.date === date) {
                        return { ...t, exercises };
                    }
                    return t;
                });
                trainingService.cacheTrainings(updated);
                return updated;
            });
            toast.success('Training updated successfully');
        } catch (error) {
            console.error('Error updating training:', error);
            toast.error(`Failed to update training: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    };

    return {
        trainings: filteredAndSortedTrainings,
        isLoading,
        error,
        searchTerm,
        setSearchTerm,
        sortField,
        sortDirection,
        handleSort,
        exerciseStats,
        deleteTraining,
        updateTraining,
        refreshTrainings: fetchTrainings
    };
};
