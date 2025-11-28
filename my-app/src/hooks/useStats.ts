import { useQuery } from '@tanstack/react-query';
import { trainingService } from '../services/trainingService';

export const useStats = () => {
    const useMuscleDistribution = () => useQuery({
        queryKey: ['stats', 'muscleDistribution'],
        queryFn: trainingService.getMuscleGroupDistribution,
    });

    const useTotalWeight = () => useQuery({
        queryKey: ['stats', 'totalWeight'],
        queryFn: trainingService.getTotalWeightPerSession,
    });

    const useTrainingDates = () => useQuery({
        queryKey: ['stats', 'dates'],
        queryFn: trainingService.getTrainingDates,
    });

    const useExerciseProgress = (exerciseName: string | null) => useQuery({
        queryKey: ['stats', 'progress', exerciseName],
        queryFn: () => trainingService.getExerciseProgress(exerciseName!),
        enabled: !!exerciseName,
    });

    const useUniqueExercises = () => useQuery({
        queryKey: ['stats', 'exercises'],
        queryFn: trainingService.getUniqueExercises,
    });

    return {
        useMuscleDistribution,
        useTotalWeight,
        useTrainingDates,
        useExerciseProgress,
        useUniqueExercises,
    };
};
