import { API_BASE_URL } from '../config';

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
}

const USER_METRICS_CACHE_KEY = 'dashboard_user_metrics_cache';
const USER_DATA_CACHE_KEY = 'dashboard_user_data_cache';

export const userService = {
    /**
     * Fetches the current user's data, including metrics.
     * Tries to return cached data first if available.
     */
    async getUserData(): Promise<UserData> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();

        // Update cache
        this.cacheUserData(data);

        return data;
    },

    /**
     * Updates the user's metrics.
     */
    async updateMetrics(metrics: UserMetrics): Promise<UserData> {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(metrics),
        });

        if (!response.ok) throw new Error('Failed to update metrics');
        const updatedData = await response.json();

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
                isAdmin: data.isAdmin
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
    getCachedUserData(): { name?: string; isAdmin?: boolean } | null {
        try {
            const cached = sessionStorage.getItem(USER_DATA_CACHE_KEY);
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    }
};
