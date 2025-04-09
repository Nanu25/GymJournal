import { useNetworkStatus } from './NetworkStatusService';
import offlineStorage from './OfflineStorageService';

interface ApiRequestConfig {
    method: string;
    url: string;
    data?: any;
    headers?: Record<string, string>;
}

class ApiInterceptor {
    private static instance: ApiInterceptor;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = 'http://localhost:3000'; // Update this with your API base URL
    }

    public static getInstance(): ApiInterceptor {
        if (!ApiInterceptor.instance) {
            ApiInterceptor.instance = new ApiInterceptor();
        }
        return ApiInterceptor.instance;
    }

    private getFullUrl(path: string): string {
        return `${this.baseUrl}${path}`;
    }

    public async request<T>(config: ApiRequestConfig): Promise<T> {
        const { isOnline, isServerAvailable } = { 
            isOnline: navigator.onLine,
            isServerAvailable: await this.checkServerAvailability()
        };

        const fullUrl = this.getFullUrl(config.url);

        // If we're offline or server is unavailable, queue the operation
        if (!isOnline || !isServerAvailable) {
            await offlineStorage.addOperation(
                config.method,
                fullUrl,
                config.data
            );

            // Return a mock response for offline operation
            return {
                success: true,
                offline: true,
                message: 'Operation queued for sync'
            } as unknown as T;
        }

        // If we're online, make the actual request
        try {
            const response = await fetch(fullUrl, {
                method: config.method,
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers,
                },
                body: config.data ? JSON.stringify(config.data) : undefined,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            // If the request fails, queue it for later
            await offlineStorage.addOperation(
                config.method,
                fullUrl,
                config.data
            );

            return {
                success: true,
                offline: true,
                message: 'Operation queued for sync due to error'
            } as unknown as T;
        }
    }

    private async checkServerAvailability(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/health`, {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' },
                signal: AbortSignal.timeout(5000)
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Convenience methods
    public async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>({ method: 'GET', url, headers });
    }

    public async post<T>(url: string, data: any, headers?: Record<string, string>): Promise<T> {
        return this.request<T>({ method: 'POST', url, data, headers });
    }

    public async put<T>(url: string, data: any, headers?: Record<string, string>): Promise<T> {
        return this.request<T>({ method: 'PUT', url, data, headers });
    }

    public async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>({ method: 'DELETE', url, headers });
    }
}

export default ApiInterceptor.getInstance(); 