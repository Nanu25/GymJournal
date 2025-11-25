
import { trainingService } from './my-app/src/services/trainingService';

// Polyfill sessionStorage and localStorage
const storageMock = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
    clear: () => { }
};
(global as any).sessionStorage = storageMock;
(global as any).localStorage = storageMock;

// Mock API_BASE_URL if needed, but trainingService imports it.
// We might need to mock the config import or ensure it resolves.
// Since we are running this with ts-node from the root, we need to handle imports.
// Actually, it's easier to just copy the service code into this script to test the logic 
// without dealing with module resolution issues for a quick test.

const API_BASE_URL = 'http://localhost:3000/api';

const service = {
    async getExercises() {
        console.log('Fetching exercises...');
        try {
            const response = await fetch(`${API_BASE_URL}/exercises`);
            console.log('Response status:', response.status);

            if (!response.ok) throw new Error("Failed to fetch exercises");

            const rawData = await response.json();
            console.log('Raw data received:', JSON.stringify(rawData).slice(0, 100) + '...');

            let exerciseData: any[] = [];

            if ('source' in rawData && 'data' in rawData) {
                console.log('Detected new format');
                exerciseData = rawData.data;
            } else if (Array.isArray(rawData)) {
                console.log('Detected old format');
                exerciseData = rawData;
            } else {
                console.log('Unknown format');
                exerciseData = [];
            }

            console.log('Processed data length:', exerciseData.length);
            if (exerciseData.length > 0) {
                console.log('First category:', exerciseData[0].category);
                console.log('First category exercises:', exerciseData[0].exercises);
            }
            return exerciseData;
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

service.getExercises();
