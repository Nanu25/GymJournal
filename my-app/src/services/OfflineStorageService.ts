import { TrainingEntry } from '../types/TrainingEntry';
import { useNetworkStatus } from './NetworkStatusService';

interface PendingOperation {
  id: string;
  method: string;
  url: string;
  data?: any;
  timestamp: number;
}

class OfflineStorageService {
  private static instance: OfflineStorageService;
  private readonly STORAGE_KEY = 'pending_operations';
  private readonly TRAININGS_KEY = 'offline_trainings';
  private readonly SERVER_URL = 'http://localhost:3000';
  private pendingOperations: PendingOperation[] = [];
  private syncInProgress = false;

  private constructor() {
    this.loadPendingOperations();
    window.addEventListener('online', () => this.syncOperations());
  }

  static getInstance(): OfflineStorageService {
    if (!OfflineStorageService.instance) {
      OfflineStorageService.instance = new OfflineStorageService();
    }
    return OfflineStorageService.instance;
  }

  // Save training data locally
  saveTrainings(trainings: TrainingEntry[]): void {
    try {
      localStorage.setItem(this.TRAININGS_KEY, JSON.stringify(trainings));
    } catch (error) {
      console.error('Failed to save trainings to localStorage:', error);
    }
  }

  // Get locally stored trainings
  getTrainings(): TrainingEntry[] {
    try {
      const stored = localStorage.getItem(this.TRAININGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get trainings from localStorage:', error);
      return [];
    }
  }

  private loadPendingOperations(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.pendingOperations = JSON.parse(stored);
    }
  }

  private savePendingOperations(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.pendingOperations));
  }

  public async addOperation(method: string, url: string, data?: any): Promise<void> {
    const operation: PendingOperation = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      method,
      url,
      data,
      timestamp: Date.now()
    };

    this.pendingOperations.push(operation);
    this.savePendingOperations();
  }

  public syncOperations(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine || this.pendingOperations.length === 0) {
      return Promise.resolve();
    }

    this.syncInProgress = true;

    return new Promise<void>(async (resolve) => {
      try {
        const pendingOps = [...this.pendingOperations];
        for (const op of pendingOps) {
          try {
            await fetch(op.url, {
              method: op.method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: op.data ? JSON.stringify(op.data) : undefined,
            });

            // Remove successful operation from queue
            this.pendingOperations = this.pendingOperations.filter(item => item.id !== op.id);
            this.savePendingOperations();
          } catch (error) {
            console.error(`Failed to sync operation: ${op.id}`, error);
            // Keep the operation in the queue for next sync attempt
          }
        }
      } finally {
        this.syncInProgress = false;
        resolve();
      }
    });
  }

  public getPendingOperationsCount(): number {
    return this.pendingOperations.length;
  }

  public clearPendingOperations(): void {
    this.pendingOperations = [];
    this.savePendingOperations();
  }
}

export default OfflineStorageService.getInstance(); 