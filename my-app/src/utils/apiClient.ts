// src/utils/apiClient.ts
interface PendingOperation {
    id: string;
    url: string;
    method: string;
    body?: any;
    timestamp: number;
}

const pendingOpsKey = "pendingOperations";
const pendingOpsCountKey = "pendingOperationsCount";
const syncStatusKey = "syncStatus";

// Queue a new operation when offline
export const queueOperation = (url: string, method: string, body?: any): string => {
    const id = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const pendingOps = getPendingOperations();

    const newOperation: PendingOperation = {
        id,
        url,
        method,
        body,
        timestamp: Date.now()
    };

    pendingOps.push(newOperation);
    localStorage.setItem(pendingOpsKey, JSON.stringify(pendingOps));
    localStorage.setItem(pendingOpsCountKey, pendingOps.length.toString());

    return id;
};

// Get all pending operations
export const getPendingOperations = (): PendingOperation[] => {
    const ops = localStorage.getItem(pendingOpsKey);
    return ops ? JSON.parse(ops) : [];
};

// Remove a completed operation
export const removeOperation = (id: string): void => {
    const pendingOps = getPendingOperations();
    const filteredOps = pendingOps.filter(op => op.id !== id);
    localStorage.setItem(pendingOpsKey, JSON.stringify(filteredOps));
    localStorage.setItem(pendingOpsCountKey, filteredOps.length.toString());
};

// Process all pending operations
export const syncPendingOperations = async (): Promise<void> => {
    const pendingOps = getPendingOperations();

    if (pendingOps.length === 0) return;

    localStorage.setItem(syncStatusKey, "pending");

    for (const op of pendingOps) {
        try {
            const response = await fetch(op.url, {
                method: op.method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: op.body ? JSON.stringify(op.body) : undefined
            });

            if (response.ok) {
                removeOperation(op.id);
            }
        } catch (error) {
            console.error(`Failed to sync operation: ${op.id}`, error);
            // Keep the operation in the queue for next sync attempt
            break;
        }
    }

    localStorage.setItem(syncStatusKey, "complete");
};

// Wrapper for fetch that handles offline capabilities
export const apiClient = async (url: string, options: RequestInit = {}) => {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body.toString()) : undefined;

    try {
        // Attempt online request
        const response = await fetch(url, options);
        return response;
    } catch (error) {
        // If network error or server down
        const isOnline = navigator.onLine;
        if (!isOnline) {
            // If it's a GET request and we have cached data, return that
            if (method === 'GET') {
                const cachedData = localStorage.getItem(`cache_${url}`);
                if (cachedData) {
                    return new Response(cachedData, {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            } else {
                // For non-GET requests, queue them for later
                queueOperation(url, method, body);
            }

            throw new Error('Offline: Operation queued');
        }

        throw error;
    }
};

// Cache GET responses for offline use
export const cacheResponse = (url: string, data: any): void => {
    localStorage.setItem(`cache_${url}`, JSON.stringify(data));
};