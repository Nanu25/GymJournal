import axios from 'axios';
import { API_BASE_URL } from '../config';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle global errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally (optional: redirect to login)
        if (error.response && error.response.status === 401) {
            // console.warn('Unauthorized access - redirecting to login...');
            // localStorage.removeItem('token');
            // window.location.href = '/login'; // careful with this in SPA
        }
        return Promise.reject(error);
    }
);

export default apiClient;
