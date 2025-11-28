import axios from 'axios';
import apiClient from './apiClient';
import { API_BASE_URL } from '../config';



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

export interface GoogleLoginData {
    token: string;
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
        createdNewUser?: boolean;
    };
    error?: string;
}

export const api = {
    auth: {
        register: async (userData: UserData): Promise<AuthResponse> => {
            try {
                const response = await apiClient.post('/auth/register', userData);
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
                const response = await apiClient.post('/auth/login', loginData);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    return error.response?.data || { success: false, error: 'Login failed' };
                }
                return { success: false, error: 'Login failed' };
            }
        },

        loginWithGoogle: async (googleData: GoogleLoginData): Promise<AuthResponse> => {
            try {
                const response = await apiClient.post('/auth/google', googleData);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    return error.response?.data || { success: false, error: 'Google login failed' };
                }
                return { success: false, error: 'Google login failed' };
            }
        },
    },

    user: {
        updateProfile: async (userData: Partial<UserData>): Promise<AuthResponse> => {
            try {
                const response = await apiClient.put('/user/profile', userData);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    return error.response?.data || { success: false, error: 'Profile update failed' };
                }
                return { success: false, error: 'Profile update failed' };
            }
        },
    },
}; 