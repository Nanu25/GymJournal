import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Add axios interceptor to include auth token in all requests
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface UserData {
    name: string;
    email: string;
    password: string;
    weight?: number;
    height?: number;
    gender?: string;
    age?: number;
    timesPerWeek?: number;
    timePerSession?: number;
    repRange?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    data?: {
        user: {
            id: string;
            name: string;
            email: string;
            weight?: number;
            height?: number;
            gender?: string;
            age?: number;
            timesPerWeek?: number;
            timePerSession?: number;
            repRange?: string;
        };
        token: string;
    };
    error?: string;
}

export const api = {
    auth: {
        register: async (userData: UserData): Promise<AuthResponse> => {
            try {
                const response = await axios.post(`${API_URL}/auth/register`, userData);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    return error.response?.data || { success: false, error: 'Registration failed' };
                }
                return { success: false, error: 'Registration failed' };
            }
        },

        login: async (loginData: LoginData): Promise<AuthResponse> => {
            try {
                const response = await axios.post(`${API_URL}/auth/login`, loginData);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    return error.response?.data || { success: false, error: 'Login failed' };
                }
                return { success: false, error: 'Login failed' };
            }
        },
    },
}; 