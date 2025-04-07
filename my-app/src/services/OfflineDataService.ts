// src/services/OfflineDataService.ts
const QUEUE_KEY = 'offline_operation_queue';
const CACHE_KEY = 'trainings_cache';

export interface OfflineOperation {
    id: string;
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    endpoint: string;
    data?: any;
    timestamp: number;
}

export const OfflineDataService = {
    // Store trainings in cache
    cacheTrainings: (trainings: any[]) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify(trainings));
    },

    // Get cached trainings
    getCachedTrainings: (): any[] => {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? JSON.parse(cached) : [];
    },

    // Queue an operation for when we're back online
    queueOperation: (operation: Omit<OfflineOperation, 'id' | 'timestamp'>) => {
        const queue = OfflineDataService.getQueue();
        const newOperation: OfflineOperation = {
            ...operation,
            id: crypto.randomUUID(),
            timestamp: Date.now()
        };

        queue.push(newOperation);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
        return newOperation.id;
    },

    // Get the current operation queue
    getQueue: (): OfflineOperation[] => {
        const queue = localStorage.getItem(QUEUE_KEY);
        return queue ? JSON.parse(queue) : [];
    },

    // Remove an operation from the queue
    removeFromQueue: (id: string) => {
        const queue = OfflineDataService.getQueue();
        const newQueue = queue.filter(op => op.id !== id);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
    },

    // Sync all queued operations with the server
    syncWithServer: async () => {
        const queue = OfflineDataService.getQueue();

        if (queue.length === 0) return { success: true };

        const results = [];

        // Process operations in order they were created
        const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);

        for (const operation of sortedQueue) {
            try {
                let response;

                switch (operation.type) {
                    case 'CREATE':
                        response = await fetch(operation.endpoint, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(operation.data)
                        });
                        break;
                    case 'UPDATE':
                        response = await fetch(operation.endpoint, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(operation.data)
                        });
                        break;
                    case 'DELETE':
                        response = await fetch(operation.endpoint, {
                            method: 'DELETE'
                        });
                        break;
                }

                if (response && response.ok) {
                    OfflineDataService.removeFromQueue(operation.id);
                    results.push({ id: operation.id, success: true });
                } else {
                    results.push({
                        id: operation.id,
                        success: false,
                        error: response ? await response.text() : 'Unknown error'
                    });
                }
            } catch (error) {
                results.push({ id: operation.id, success: false, error });
            }
        }

        return {
            success: results.every(r => r.success),
            results
        };
    },

    // Clear all data
    clearAll: () => {
        localStorage.removeItem(QUEUE_KEY);
        localStorage.removeItem(CACHE_KEY);
    }
};