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