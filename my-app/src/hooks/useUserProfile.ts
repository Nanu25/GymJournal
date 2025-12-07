import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

interface UserProfile {
    name: string;
    weight?: number;
    height?: number;
    gender?: string;
    isAdmin?: boolean;
}

interface UseUserProfileReturn {
    profile: UserProfile;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
    const [profile, setProfile] = useState<UserProfile>(() => {
        // Initialize with cached data to prevent flash of empty content
        const cachedUser = userService.getCachedUserData();
        const cachedMetrics = userService.getCachedMetrics();
        return {
            name: cachedUser?.name || "Fitness Enthusiast",
            weight: cachedMetrics?.weight,
            height: cachedMetrics?.height,
            gender: cachedUser?.gender,
            isAdmin: cachedUser?.isAdmin
        };
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userService.getUserData();

            setProfile({
                name: data.name || "Fitness Enthusiast",
                weight: data.weight ?? data.metrics?.weight,
                height: data.height ?? data.metrics?.height,
                gender: data.gender,
                isAdmin: data.isAdmin
            });
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError(err instanceof Error ? err.message : "Failed to load user profile");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    return {
        profile,
        loading,
        error,
        refetch: fetchUserProfile
    };
};
