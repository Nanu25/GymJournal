// src/services/NetworkStatusService.ts
import { useState, useEffect, useCallback } from 'react';

const SERVER_ENDPOINT = '/api/health'; // Add this endpoint to your backend
const CHECK_INTERVAL = 30000; // Check server every 30 seconds

export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isServerAvailable, setIsServerAvailable] = useState(true);

    // Check server health
    const checkServerHealth = useCallback(async () => {
        if (!navigator.onLine) {
            setIsServerAvailable(false);
            return;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(SERVER_ENDPOINT, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            setIsServerAvailable(response.ok);
        } catch (error) {
            setIsServerAvailable(false);
        }
    }, []);

    useEffect(() => {
        // Handle online/offline events
        const handleOnline = () => {
            setIsOnline(true);
            checkServerHealth();
        };

        const handleOffline = () => {
            setIsOnline(false);
            setIsServerAvailable(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Set up periodic server checks
        const intervalId = setInterval(checkServerHealth, CHECK_INTERVAL);

        // Initial check
        checkServerHealth();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(intervalId);
        };
    }, [checkServerHealth]);

    return { isOnline, isServerAvailable };
};