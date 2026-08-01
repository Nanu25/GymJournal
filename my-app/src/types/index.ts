export enum UserRole {
    REGULAR = 'regular',
    ADMIN = 'admin'
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isMonitored: boolean;
    weight?: number;
    height?: number;
    gender?: string;
    age?: number;
    timesPerWeek?: number;
    timePerSession?: number;
    repRange?: string;
    lastLogin?: string;
    lastActivity?: string;
    createdAt: string;
    updatedAt: string;
}

export enum ActionType {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete'
}

export interface ActivityLog {
    id: string;
    userId: string;
    user: User;
    action: ActionType;
    entityType: string;
    entityId?: string;
    details?: Record<string, any>;
    timestamp: string;
}

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: string;
}

export interface TrainingExercise {
    id: string;
    trainingId: string;
    exerciseId: string;
    exercise: Exercise;
    sets: number;
    reps: number;
    weight: number;
    order: number;
}

export interface Training {
    id: string;
    userId: string;
    date: string;
    name: string;
    exercises: TrainingExercise[];
    createdAt: string;
    updatedAt: string;
}