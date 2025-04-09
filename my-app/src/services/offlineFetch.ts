// src/services/offlineFetch.ts
import { offlineManager } from './OfflineManager';

export async function offlineFetch(url: string, options: RequestInit = {}) {
    const status = offlineManager.getStatus();

    // If we're online and server is available, make the actual request
    if (status.isOnline && status.isServerAvailable) {
        return fetch(url, options);
    }

    // For GET requests when offline, we can't do much except fail
    if (options.method === 'GET' || !options.method) {
        throw new Error('Cannot perform GET request while offline');
    }

    // For mutation operations (POST, PUT, DELETE), queue them
    const body = options.body ?
        (typeof options.body === 'string' ? JSON.parse(options.body) : options.body)
        : null;

    const id = offlineManager.addPendingOperation(url, options.method, body);

    // Return a mock successful response
    return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id, offlineOperation: true }),
        text: () => Promise.resolve(JSON.stringify({ id, offlineOperation: true })),
    } as Response);
}