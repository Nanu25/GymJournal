import axios from 'axios';
import { TrainingEntry } from '../types';

const STORAGE_KEY = 'training_records';
const API_URL = 'http://localhost:3000/api/trainings';

class OfflineSyncService {
    private isOnline: boolean = navigator.onLine;
    private serverAvailable: boolean = true;

    constructor() {
        // Listen for online/offline status changes
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    private handleOnline() {
        this.isOnline = true;
        this.checkServerAvailability();
    }

    private handleOffline() {
        this.isOnline = false;
    }

    private async checkServerAvailability() {
        try {
            await axios.get(API_URL);
            this.serverAvailable = true;
        } catch (error) {
            this.serverAvailable = false;
        }
    }

    public isServerOnline(): boolean {
        return this.isOnline && this.serverAvailable;
    }

    private getLocalTrainings(): TrainingEntry[] {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    private saveLocalTrainings(trainings: TrainingEntry[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trainings));
    }

    public async getAllTrainings(): Promise<TrainingEntry[]> {
        if (this.isServerOnline()) {
            try {
                const response = await axios.get(API_URL);
                // Update local storage with server data
                this.saveLocalTrainings(response.data);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch from server, using local data:', error);
            }
        }
        return this.getLocalTrainings();
    }

    public async createTraining(training: TrainingEntry): Promise<TrainingEntry> {
        if (this.isServerOnline()) {
            try {
                const response = await axios.post(API_URL, training);
                const updatedTrainings = this.getLocalTrainings();
                updatedTrainings.push(response.data);
                this.saveLocalTrainings(updatedTrainings);
                return response.data;
            } catch (error) {
                console.error('Failed to create on server, saving locally:', error);
            }
        }
        
        const updatedTrainings = this.getLocalTrainings();
        updatedTrainings.push(training);
        this.saveLocalTrainings(updatedTrainings);
        return training;
    }

    public async updateTraining(training: TrainingEntry): Promise<TrainingEntry> {
        if (this.isServerOnline()) {
            try {
                const response = await axios.put(`${API_URL}/${training.date}`, training);
                const updatedTrainings = this.getLocalTrainings().map(t => 
                    t.date === training.date ? response.data : t
                );
                this.saveLocalTrainings(updatedTrainings);
                return response.data;
            } catch (error) {
                console.error('Failed to update on server, saving locally:', error);
            }
        }
        
        const updatedTrainings = this.getLocalTrainings().map(t => 
            t.date === training.date ? training : t
        );
        this.saveLocalTrainings(updatedTrainings);
        return training;
    }

    public async deleteTraining(date: string): Promise<void> {
        if (this.isServerOnline()) {
            try {
                await axios.delete(`${API_URL}/${date}`);
            } catch (error) {
                console.error('Failed to delete on server, deleting locally:', error);
            }
        }
        
        const updatedTrainings = this.getLocalTrainings().filter(t => t.date !== date);
        this.saveLocalTrainings(updatedTrainings);
    }
}

export const offlineSyncService = new OfflineSyncService(); 