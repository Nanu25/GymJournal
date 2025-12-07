import apiClient from './apiClient';

export interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

export interface MuscleGroupData {
    [key: string]: number;
}

export interface TotalWeightData {
    date: string;
    totalWeight: number;
}

export const trainingService = {
    /**
     * Fetches all trainings.
     */
    async getAllTrainings(): Promise<TrainingEntry[]> {
        const response = await apiClient.get('/trainings?limit=0');
        const data = response.data;
        return data.data && Array.isArray(data.data)
            ? data.data
            : Array.isArray(data) ? data : [];
    },

    /**
     * Fetches muscle group distribution data.
     */
    async getMuscleGroupDistribution(): Promise<MuscleGroupData> {
        const response = await apiClient.get('/trainings/muscle-group-distribution');
        return response.data;
    },

    /**
     * Fetches total weight per session data.
     */
    async getTotalWeightPerSession(): Promise<TotalWeightData[]> {
        const response = await apiClient.get('/trainings/total-weight');
        return response.data;
    },

    /**
     * Creates a new training session.
     */
    async createTraining(data: { date: string; exercises: { [key: string]: number } }): Promise<void> {
        await apiClient.post('/trainings', data);
    },

    /**
     * Updates an existing training session.
     */
    async updateTraining(date: string, data: { date: string; exercises: { [key: string]: number } }): Promise<void> {
        // Send both the new date (in body) and exercises
        await apiClient.put(`/trainings/${encodeURIComponent(date)}`, {
            date: data.date,
            exercises: data.exercises
        });
    },

    /**
     * Deletes a training session.
     */
    async deleteTraining(date: string): Promise<void> {
        try {
            await apiClient.delete(`/trainings/${encodeURIComponent(date)}`);
        } catch (error: any) {
            // If the resource is not found (404), consider it already deleted
            if (error.response && error.response.status === 404) {
                return;
            }
            throw error;
        }
    },

    /**
     * Fetches distinct training dates for the heatmap.
     */
    async getTrainingDates(): Promise<string[]> {
        const response = await apiClient.get('/trainings/dates');
        return response.data;
    },

    /**
     * Fetches progress data for a specific exercise.
     */
    async getExerciseProgress(exerciseName: string): Promise<{ date: string; weight: number }[]> {
        const response = await apiClient.get(`/trainings/exercise-progress/${encodeURIComponent(exerciseName)}`);
        return response.data;
    },

    /**
     * Fetches list of unique exercises performed by the user.
     */
    async getUniqueExercises(): Promise<string[]> {
        const response = await apiClient.get('/trainings/exercises');
        return response.data;
    },

    /**
     * Fetches all available exercises with categories.
     */
    async getExercises(): Promise<{ category: string; exercises: string[] }[]> {
        const response = await apiClient.get('/exercises');
        const rawData = response.data;

        if ('source' in rawData && 'data' in rawData) {
            // New format with metadata
            return rawData.data;
        } else if (Array.isArray(rawData)) {
            // Old format (direct array)
            return rawData;
        } else {
            // Fallback or empty
            return [];
        }
    },

    /**
     * Fetches muscle groups trained in the last 48 hours.
     */
    async getRecentMuscleGroups(): Promise<string[]> {
        const response = await apiClient.get('/trainings/recent-muscles');
        return response.data;
    }
};
