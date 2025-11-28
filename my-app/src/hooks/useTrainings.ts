import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingService, TrainingEntry } from '../services/trainingService';
import toast from 'react-hot-toast';

export const useTrainings = () => {
    return useQuery({
        queryKey: ['trainings'],
        queryFn: trainingService.getAllTrainings,
    });
};

export const useTrainingMutations = () => {
    const queryClient = useQueryClient();

    const createTraining = useMutation({
        mutationFn: trainingService.createTraining,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainings'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] }); // Invalidate stats too
            toast.success('Training added successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to add training');
        },
    });

    const updateTraining = useMutation({
        mutationFn: ({ date, data }: { date: string; data: Partial<TrainingEntry> }) =>
            trainingService.updateTraining(date, data as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainings'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
            toast.success('Training updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update training');
        },
    });

    const deleteTraining = useMutation({
        mutationFn: trainingService.deleteTraining,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trainings'] });
            queryClient.invalidateQueries({ queryKey: ['stats'] });
            toast.success('Training deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to delete training');
        },
    });

    return {
        createTraining,
        updateTraining,
        deleteTraining,
    };
};

export const useExercises = () => {
    return useQuery({
        queryKey: ['exercises'],
        queryFn: trainingService.getExercises,
        staleTime: 1000 * 60 * 60, // 1 hour cache for exercises
    });
};
