// my-app/src/hooks/useOfflineAwareApi.ts
import { useState, useEffect, useCallback } from 'react';

// Interface for training data
interface TrainingEntry {
    date: string;
    exercises: { [key: string]: number };
}

// Interface for pending operations
interface PendingOperation {
    id: string;
    type: 'create' | 'update' | 'delete';
    data: any;
    timestamp: number;
}

export const useOfflineAwareApi = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isServerAvailable, setIsServerAvailable] = useState(true);
    const [pendingOperations, setPendingOperations] = useState<PendingOperation[]>([]);
    const [trainings, setTrainings] = useState<TrainingEntry[]>([]);

    // Load pending operations from localStorage on initial render
    useEffect(() => {
        const storedOperations = localStorage.getItem('pendingOperations');
        if (storedOperations) {
            setPendingOperations(JSON.parse(storedOperations));
        }

        // Check server availability
        checkServerAvailability();
    }, []);

    // Set up online/offline event listeners
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            checkServerAvailability();
        };

        const handleOffline = () => {
            setIsOnline(false);
            setIsServerAvailable(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Save pending operations to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('pendingOperations', JSON.stringify(pendingOperations));
    }, [pendingOperations]);

    // Check if the server is available
    const checkServerAvailability = useCallback(async () => {
        if (!navigator.onLine) {
            setIsServerAvailable(false);
            return;
        }

        try {
            const response = await fetch('/api/health', {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' },
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            setIsServerAvailable(response.ok);
        } catch (error) {
            console.log('Server unavailable:', error);
            setIsServerAvailable(false);
        }
    }, []);

    // Add a pending operation
    const addPendingOperation = (type: 'create' | 'update' | 'delete', data: any) => {
        const newOperation: PendingOperation = {
            id: crypto.randomUUID(),
            type,
            data,
            timestamp: Date.now(),
        };

        setPendingOperations(prev => [...prev, newOperation]);
        return newOperation.id;
    };

    // Get trainings (from server if online, from local cache if offline)
    const getTrainings = useCallback(async () => {
        // First try to get from server if online
        if (isOnline && isServerAvailable) {
            try {
                const response = await fetch('/api/trainings');
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('cachedTrainings', JSON.stringify(data));
                    setTrainings(data);
                    return data;
                }
            } catch (error) {
                console.error('Error fetching trainings from server:', error);
            }
        }

        // Fall back to cached data
        const cachedData = localStorage.getItem('cachedTrainings');
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);

            // Apply pending operations to cached data to get current state
            const updatedData = applyPendingOperations(parsedData);
            setTrainings(updatedData);
            return updatedData;
        }

        return [];
    }, [isOnline, isServerAvailable]);

    // Apply pending operations to data
    const applyPendingOperations = (data: TrainingEntry[]) => {
        let result = [...data];

        pendingOperations.forEach(op => {
            if (op.type === 'create') {
                result.push(op.data);
            } else if (op.type === 'update') {
                const index = result.findIndex(item => item.date === op.data.date);
                if (index !== -1) {
                    result[index] = op.data;
                }
            } else if (op.type === 'delete') {
                result = result.filter(item => item.date !== op.data.date);
            }
        });

        return result;
    };

    // Create training (send to server if online, queue if offline)
    const createTraining = async (trainingData: TrainingEntry) => {
        if (isOnline && isServerAvailable) {
            try {
                const response = await fetch('/api/trainings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trainingData),
                });

                if (response.ok) {
                    await getTrainings(); // Refresh data
                    return await response.json();
                } else {
                    throw new Error('Failed to create training');
                }
            } catch (error) {
                console.error('Error creating training:', error);
                // Fall back to offline mode if server request fails
                addPendingOperation('create', trainingData);
                await getTrainings(); // Refresh with local changes
                return trainingData;
            }
        } else {
            // Store locally when offline
            addPendingOperation('create', trainingData);
            await getTrainings(); // Refresh with local changes
            return trainingData;
        }
    };

    // Update training
    const updateTraining = async (date: string, updatedData: TrainingEntry) => {
        if (isOnline && isServerAvailable) {
            try {
                const response = await fetch(`/api/trainings/${encodeURIComponent(date)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData),
                });

                if (response.ok) {
                    await getTrainings(); // Refresh data
                    return await response.json();
                } else {
                    throw new Error('Failed to update training');
                }
            } catch (error) {
                console.error('Error updating training:', error);
                // Fall back to offline mode
                addPendingOperation('update', updatedData);
                await getTrainings(); // Refresh with local changes
                return updatedData;
            }
        } else {
            // Store locally when offline
            addPendingOperation('update', updatedData);
            await getTrainings(); // Refresh with local changes
            return updatedData;
        }
    };

    // Delete training
    const deleteTraining = async (trainingDate: string) => {
        if (isOnline && isServerAvailable) {
            try {
                const response = await fetch(`/api/trainings/${encodeURIComponent(trainingDate)}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    await getTrainings(); // Refresh data
                    return true;
                } else {
                    throw new Error('Failed to delete training');
                }
            } catch (error) {
                console.error('Error deleting training:', error);
                // Fall back to offline mode
                addPendingOperation('delete', { date: trainingDate });
                await getTrainings(); // Refresh with local changes
                return true;
            }
        } else {
            // Store locally when offline
            addPendingOperation('delete', { date: trainingDate });
            await getTrainings(); // Refresh with local changes
            return true;
        }
    };

    // Sync pending operations when back online
    const syncPendingOperations = async () => {
        if (!isOnline || !isServerAvailable || pendingOperations.length === 0) {
            return;
        }

        const operations = [...pendingOperations];
        let successfulOps = [];

        for (const op of operations) {
            try {
                if (op.type === 'create') {
                    await fetch('/api/trainings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(op.data),
                    });
                    successfulOps.push(op.id);
                }
                else if (op.type === 'update') {
                    await fetch(`/api/trainings/${encodeURIComponent(op.data.date)}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(op.data),
                    });
                    successfulOps.push(op.id);
                }
                else if (op.type === 'delete') {
                    await fetch(`/api/trainings/${encodeURIComponent(op.data.date)}`, {
                        method: 'DELETE',
                    });
                    successfulOps.push(op.id);
                }
            } catch (error) {
                console.error(`Failed to sync operation ${op.id}:`, error);
            }
        }

        // Remove successful operations from pending list
        setPendingOperations(prev =>
            prev.filter(op => !successfulOps.includes(op.id))
        );

        // Refresh training data
        await getTrainings();
    };

    return {
        isOnline,
        isServerAvailable,
        pendingOperations: pendingOperations.length,
        getTrainings,
        createTraining,
        updateTraining,
        deleteTraining,
        syncPendingOperations,
        checkServerAvailability,
    };
};