// src/services/OfflineManager.ts

type PendingOperation = {
    id: string;
    url: string;
    method: string;
    body: any;
    timestamp: number;
};

interface OfflineStatus {
    isOffline: boolean;
    isServerAvailable: boolean;
    pendingItems: number;
}

class OfflineManager {
    private pendingOperations: PendingOperation[] = [];
    private isOnline: boolean = navigator.onLine;
    private isServerAvailable: boolean = true;
    private listeners: Array<(status: OfflineStatus) => void> = [];

    constructor() {
        // Load any saved operations from localStorage
        this.loadPendingOperations();

        // Set up event listeners for online/offline status
        window.addEventListener('online', this.handleOnlineStatus);
        window.addEventListener('offline', this.handleOnlineStatus);

        // Initialize status
        this.handleOnlineStatus();

        // Check server availability periodically
        this.checkServerAvailability();
        setInterval(() => this.checkServerAvailability(), 30000); // Every 30 seconds
    }

    private loadPendingOperations() {
        try {
            const savedOps = localStorage.getItem('pendingOperations');
            if (savedOps) {
                this.pendingOperations = JSON.parse(savedOps);
            }
        } catch (e) {
            console.error('Failed to load pending operations', e);
            this.pendingOperations = [];
        }
    }

    private savePendingOperations() {
        try {
            localStorage.setItem('pendingOperations', JSON.stringify(this.pendingOperations));
        } catch (e) {
            console.error('Failed to save pending operations', e);
        }
    }

    private handleOnlineStatus = () => {
        this.isOnline = navigator.onLine;
        this.notifyListeners();

        if (this.isOnline && this.isServerAvailable) {
            this.processPendingOperations();
        }
    }

    private async checkServerAvailability() {
        if (!this.isOnline) {
            this.isServerAvailable = false;
            this.notifyListeners();
            return;
        }

        try {
            // Use a lightweight API endpoint to check server availability
            const response = await fetch('/api/health', {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' },
                // Short timeout to detect server issues quickly
                signal: AbortSignal.timeout(3000)
            });

            this.isServerAvailable = response.ok;
        } catch (e) {
            this.isServerAvailable = false;
        }

        this.notifyListeners();

        if (this.isOnline && this.isServerAvailable) {
            this.processPendingOperations();
        }
    }

    private async processPendingOperations() {
        if (this.pendingOperations.length === 0) return;

        // Create a copy of the operations we'll attempt to process
        const operationsToProcess = [...this.pendingOperations];

        for (const operation of operationsToProcess) {
            try {
                const response = await fetch(operation.url, {
                    method: operation.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(operation.body)
                });

                if (response.ok) {
                    // Remove the operation if it succeeded
                    this.pendingOperations = this.pendingOperations.filter(op => op.id !== operation.id);
                    this.savePendingOperations();
                    this.notifyListeners();
                } else {
                    console.error(`Failed to process operation: ${operation.url}`, await response.text());
                }
            } catch (e) {
                console.error(`Error processing operation: ${operation.url}`, e);
                // If we get here, we're likely offline again or server is down
                break;
            }
        }
    }

    public addPendingOperation(url: string, method: string, body: any): string {
        const id = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        this.pendingOperations.push({
            id,
            url,
            method,
            body,
            timestamp: Date.now()
        });

        this.savePendingOperations();
        this.notifyListeners();

        return id;
    }

    public getStatus(): OfflineStatus {
        return {
            isOffline: !this.isOnline,
            isServerAvailable: this.isServerAvailable,
            pendingItems: this.pendingOperations.length
        };
    }

    public subscribe(callback: (status: OfflineStatus) => void) {
        this.listeners.push(callback);

        // Immediately notify with current status
        callback(this.getStatus());

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    private notifyListeners() {
        const status = this.getStatus();
        this.listeners.forEach(listener => listener(status));
    }
}

export const offlineManager = new OfflineManager();