import { API_BASE_URL } from '../config';

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

const TRAININGS_CACHE_KEY = 'dashboard_trainings_cache';

export const trainingService = {
    /**
     * Fetches all trainings.
     * Tries to return cached data first if available.
     */
    async getAllTrainings(): Promise<TrainingEntry[]> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/trainings?limit=0`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch trainings");

        const data = await response.json();
        const trainings = data.data && Array.isArray(data.data)
            ? data.data
            : Array.isArray(data) ? data : [];

        // Update cache
        this.cacheTrainings(trainings);

        return trainings;
    },

    /**
     * Fetches muscle group distribution data.
     */
    async getMuscleGroupDistribution(): Promise<MuscleGroupData> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/trainings/muscle-group-distribution`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);

        return await response.json();
    },

    /**
     * Fetches total weight per session data.
     */
    async getTotalWeightPerSession(): Promise<TotalWeightData[]> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/trainings/total-weight`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch total weight data");

        return await response.json();
    },

    /**
     * Helper to cache trainings to sessionStorage
     */
    cacheTrainings(data: TrainingEntry[]) {
        try {
            sessionStorage.setItem(TRAININGS_CACHE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn('Unable to cache trainings:', error);
        }
    },

    /**
     * Retrieves cached trainings if available
     */
    getCachedTrainings(): TrainingEntry[] {
        try {
            const cached = sessionStorage.getItem(TRAININGS_CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    },

    /**
     * Updates an existing training session.
     */
    async updateTraining(date: string, data: { date: string; exercises: { [key: string]: number } }): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/trainings/${encodeURIComponent(date)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to update training');
        }
    },

    /**
     * Deletes a training session.
     */
    async deleteTraining(date: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/trainings/${encodeURIComponent(date)}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // If the resource is not found (404), consider it already deleted
        if (!response.ok && response.status !== 404) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to delete training');
        }
    },

    /**
     * Fetches all available exercises with categories.
     * Tries to return cached data first if available.
     */
    async getExercises(): Promise<{ category: string; exercises: string[] }[]> {
        const EXERCISES_CACHE_KEY = 'training_exercises_cache_v3';

        try {
            const cached = sessionStorage.getItem(EXERCISES_CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                // Validate cache structure
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].category) {
                    return parsed;
                }
                console.warn('Invalid or empty cache found, refetching...');
                sessionStorage.removeItem(EXERCISES_CACHE_KEY);
            }
        } catch (e) {
            console.warn('Failed to read from session storage', e);
        }

        const response = await fetch(`${API_BASE_URL}/exercises`);
        if (!response.ok) throw new Error("Failed to fetch exercises");

        const rawData = await response.json();
        let exerciseData: { category: string; exercises: string[] }[] = [];
        let isMock = false;

        if ('source' in rawData && 'data' in rawData) {
            // New format with metadata
            exerciseData = rawData.data;
            isMock = rawData.source === 'mock';
        } else if (Array.isArray(rawData)) {
            // Old format (direct array)
            exerciseData = rawData;
        } else {
            // Fallback or empty
            exerciseData = [];
        }

        // Only cache if it's not mock data and we have data
        if (!isMock && exerciseData.length > 0) {
            try {
                sessionStorage.setItem(EXERCISES_CACHE_KEY, JSON.stringify(exerciseData));
            } catch (e) {
                console.warn('Failed to write to session storage', e);
            }
        }

        return exerciseData;
    }
};
