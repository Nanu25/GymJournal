import apiClient from './apiClient';

export interface UserMetrics {
    weight?: number;
    height?: number;
    age?: number;
    timesPerWeek?: number;
    timePerSession?: number;
    repRange?: string;
}

export interface UserData {
    name?: string;
    email?: string;
    metrics?: UserMetrics;
    // Flattened properties often returned by the API
    weight?: number;
    height?: number;
    age?: number;
    timesPerWeek?: number;
    timePerSession?: number;
    repRange?: string;
    isAdmin?: boolean;
    gender?: string;
}

const USER_METRICS_CACHE_KEY = 'dashboard_user_metrics_cache';
const USER_DATA_CACHE_KEY = 'dashboard_user_data_cache';

export const userService = {
    /**
     * Fetches the current user's data, including metrics.
     * Tries to return cached data first if available.
     */
    async getUserData(): Promise<UserData> {
        const response = await apiClient.get('/user');
        const data = response.data;

        // Update cache
        this.cacheUserData(data);

        return data;
    },

    /**
     * Updates the user's metrics.
     */
    async updateMetrics(metrics: UserMetrics): Promise<UserData> {
        const response = await apiClient.put('/user', metrics);
        const updatedData = response.data;

        // Update cache
        this.cacheUserData(updatedData);

        return updatedData;
    },

    /**
     * Helper to cache user data and metrics to sessionStorage
     */
    cacheUserData(data: UserData) {
        try {
            // Cache full user data
            sessionStorage.setItem(USER_DATA_CACHE_KEY, JSON.stringify({
                name: data.name,
                email: data.email,
                isAdmin: data.isAdmin,
                gender: data.gender
            }));

            // Cache metrics specifically
            const metrics: UserMetrics = {
                weight: data.weight ?? data.metrics?.weight,
                height: data.height ?? data.metrics?.height,
                age: data.age ?? data.metrics?.age,
                timesPerWeek: data.timesPerWeek ?? data.metrics?.timesPerWeek,
                timePerSession: data.timePerSession ?? data.metrics?.timePerSession,
                repRange: data.repRange ?? data.metrics?.repRange,
            };
            sessionStorage.setItem(USER_METRICS_CACHE_KEY, JSON.stringify(metrics));
        } catch (error) {
            console.warn('Unable to cache user data:', error);
        }
    },

    /**
     * Retrieves cached metrics if available
     */
    getCachedMetrics(): UserMetrics | null {
        try {
            const cached = sessionStorage.getItem(USER_METRICS_CACHE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    },

    /**
     * Retrieves cached user info (name, email) if available
     */
    getCachedUserData(): { name?: string; isAdmin?: boolean; gender?: string } | null {
        try {
            const cached = sessionStorage.getItem(USER_DATA_CACHE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    }
};
