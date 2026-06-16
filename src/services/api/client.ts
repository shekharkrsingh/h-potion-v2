import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getValidToken, getRefreshToken, removeToken, setToken } from '@/services/auth/tokenService';
import { API_BASE_URL, endpoints } from './endpoints';

// Extend AxiosRequestConfig to include skipAuth
declare module 'axios' {
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    timestamp?: string;
}

export const client: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Check if we should skip authentication for this request
        if (!config.skipAuth) {
            const token = await getValidToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // Best Practice: Let browser/engine handle multipart/form-data boundary
        if (config.data instanceof FormData && config.headers) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; skipAuth?: boolean };

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !originalRequest.skipAuth) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return client(originalRequest);
                })
                .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${API_BASE_URL}${endpoints.auth.refresh}`, { refreshToken });
                const newAccessToken = response.data.data.token;
                const newRefreshToken = response.data.data.refreshToken;
                
                await setToken(newAccessToken, newRefreshToken);
                
                originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
                processQueue(null, newAccessToken);
                return client(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                await removeToken();
                return Promise.reject(handleApiError(error)); // Return original 401 error
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(handleApiError(error));
    }
);

const handleApiError = (error: AxiosError<any>) => {
    if (error.response) {
        return {
            message: error.response.data?.message || 'Something went wrong',
            status: error.response.status,
            data: error.response.data,
        };
    } else if (error.request) {
        return {
            message: 'Network error. Please check your connection.',
            status: 0,
        };
    } else {
        return {
            message: error.message,
            status: -1,
        };
    }
};
