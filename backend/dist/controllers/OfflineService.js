"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offlineService = void 0;
// src/services/OfflineService.ts
const react_toastify_1 = require("react-toastify"); // You'll need to install this
class OfflineService {
    constructor() {
        this.isOnline = navigator.onLine;
        this.isServerAvailable = true;
        this.pendingOperations = [];
        this.listeners = [];
        this.serverCheckInterval = null;
        this.STORAGE_KEY = 'offline_operations';
        this.loadPendingOperations = () => {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                try {
                    this.pendingOperations = JSON.parse(stored);
                }
                catch (e) {
                    console.error('Failed to parse stored operations:', e);
                    localStorage.removeItem(this.STORAGE_KEY);
                }
            }
        };
        this.savePendingOperations = () => {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.pendingOperations));
        };
        this.handleNetworkChange = () => {
            const wasOnline = this.isOnline;
            this.isOnline = navigator.onLine;
            // If we just came back online, try to sync and check server
            if (!wasOnline && this.isOnline) {
                this.checkServerStatus();
                this.syncPendingOperations();
            }
            this.notifyListeners();
        };
        this.checkServerStatus = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.isOnline) {
                this.isServerAvailable = false;
                this.notifyListeners();
                return;
            }
            try {
                // Simple endpoint to check if server is alive
                const response = yield fetch('/api/health', {
                    method: 'GET',
                    headers: { 'Cache-Control': 'no-cache' },
                    signal: AbortSignal.timeout(5000) // 5 second timeout
                });
                const wasServerAvailable = this.isServerAvailable;
                this.isServerAvailable = response.ok;
                // If server just became available, sync operations
                if (!wasServerAvailable && this.isServerAvailable) {
                    this.syncPendingOperations();
                }
            }
            catch (error) {
                this.isServerAvailable = false;
            }
            this.notifyListeners();
        });
        this.notifyListeners = () => {
            this.listeners.forEach(listener => listener(this.isOnline, this.isServerAvailable));
        };
        // Sync all pending operations with the server
        this.syncPendingOperations = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.isOnline || !this.isServerAvailable || this.pendingOperations.length === 0) {
                return;
            }
            // Sort operations by timestamp (oldest first)
            const sortedOperations = [...this.pendingOperations].sort((a, b) => a.timestamp - b.timestamp);
            for (const operation of sortedOperations) {
                try {
                    const response = yield fetch(operation.endpoint, {
                        method: operation.method,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: operation.method !== 'GET' ? JSON.stringify(operation.body) : undefined
                    });
                    if (response.ok) {
                        // Remove successfully synced operation
                        this.pendingOperations = this.pendingOperations.filter(op => op.id !== operation.id);
                        this.savePendingOperations();
                        react_toastify_1.toast.success('Synced offline changes');
                    }
                    else {
                        console.error('Failed to sync operation:', operation, yield response.text());
                    }
                }
                catch (error) {
                    console.error('Error syncing operation:', error);
                    // Stop syncing if we encounter an error
                    break;
                }
            }
        });
        // Add a new operation to be performed offline
        this.addOperation = (endpoint, method, body) => {
            const operationId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const operation = {
                id: operationId,
                endpoint,
                method,
                body,
                timestamp: Date.now()
            };
            this.pendingOperations.push(operation);
            this.savePendingOperations();
            // Return a promise that resolves with mocked data
            return Promise.resolve({ success: true, offline: true, operationId });
        };
        // Check if we can perform an operation online
        this.canOperateOnline = () => {
            return this.isOnline && this.isServerAvailable;
        };
        // Register a listener for status changes
        this.addStatusListener = (callback) => {
            this.listeners.push(callback);
            // Immediately call with current status
            callback(this.isOnline, this.isServerAvailable);
            return () => {
                this.listeners = this.listeners.filter(listener => listener !== callback);
            };
        };
        // Get current status
        this.getStatus = () => {
            return {
                isOnline: this.isOnline,
                isServerAvailable: this.isServerAvailable,
                pendingOperationsCount: this.pendingOperations.length
            };
        };
        // Clean up event listeners
        this.cleanup = () => {
            window.removeEventListener('online', this.handleNetworkChange);
            window.removeEventListener('offline', this.handleNetworkChange);
            if (this.serverCheckInterval) {
                clearInterval(this.serverCheckInterval);
            }
        };
        // Initialize from localStorage if available
        this.loadPendingOperations();
        // Listen for online/offline events
        window.addEventListener('online', this.handleNetworkChange);
        window.addEventListener('offline', this.handleNetworkChange);
        // Check server status periodically
        this.serverCheckInterval = setInterval(this.checkServerStatus, 30000);
        this.checkServerStatus();
    }
}
// Create a singleton instance
exports.offlineService = new OfflineService();
exports.default = exports.offlineService;
