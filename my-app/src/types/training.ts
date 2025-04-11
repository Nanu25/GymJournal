export interface TrainingEntry {
    date: string;
    exercises: {
        [key: string]: number;
    };
} 