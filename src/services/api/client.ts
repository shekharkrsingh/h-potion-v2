import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getValidToken, removeToken } from '@/services/auth/tokenService';
import { API_BASE_URL } from './endpoints';

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

client.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            await removeToken();
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
