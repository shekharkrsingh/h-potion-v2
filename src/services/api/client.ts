import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidToken, getRefreshToken, removeToken, setToken, getRoleFromToken } from '@/services/auth/tokenService';
import { API_BASE_URL, endpoints } from './endpoints';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    timestamp?: string;
}

interface RequestConfig {
    skipAuth?: boolean;
    headers?: Record<string, string>;
    signal?: AbortSignal;
    timeout?: number;
    params?: Record<string, any>;
    responseType?: 'json' | 'blob' | 'arraybuffer' | 'text' | 'stream' | 'document';
}

interface ApiError {
    message: string;
    status: number;
    data?: any;
    response?: {
        data?: any;
        status?: number;
    };
}

// ─── Token Refresh Queue ───────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

// ─── Error Formatter ──────────────────────────────────────────────────────────

const makeError = (message: string, status: number, data?: any): ApiError => ({
    message,
    status,
    data,
    response: data ? { data, status } : undefined,
});

// ─── Build Request Headers ─────────────────────────────────────────────────────

const buildHeaders = async (
    body: any,
    config: RequestConfig = {}
): Promise<Record<string, string>> => {
    const headers: Record<string, string> = { ...config.headers };

    // Only set JSON content-type if body is not FormData
    if (!(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (!config.skipAuth) {
        const token = await getValidToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    // Collaborator-specific headers
    const role = await getRoleFromToken();

    if (role === 'COLLABORATOR') {
        const activeDoctorId = await AsyncStorage.getItem('activeDoctorId');
        if (activeDoctorId) {
            headers['X-Active-Doctor-Id'] = activeDoctorId;
        }
    }

    if (role && ['ENTITY_ADMIN', 'ENTITY_SUPERVISOR', 'ENTITY_COLLABORATOR'].includes(role)) {
        const activeEntityId = await AsyncStorage.getItem('activeEntityId');
        const activeAffiliationId = await AsyncStorage.getItem('activeAffiliationId');
        if (activeEntityId) headers['X-Active-Entity-Id'] = activeEntityId;
        if (activeAffiliationId) headers['X-Active-Affiliation-Id'] = activeAffiliationId;
    }

    return headers;
};

// ─── Core Request Function ─────────────────────────────────────────────────────

const request = async <T = any>(
    method: string,
    url: string,
    body?: any,
    config: RequestConfig = {}
): Promise<{ data: T; status: number; headers: any }> => {
    let fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    // Append query params if they exist
    if (config.params) {
        const queryParams = new URLSearchParams();
        Object.entries(config.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        if (queryString) {
            fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
        }
    }

    const timeout = config.timeout ?? 30000;

    const doFetch = async (overrideToken?: string): Promise<{ data: T; status: number; headers: any }> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const headers = await buildHeaders(body, config);

            // Override Authorization if we just refreshed
            if (overrideToken) {
                headers['Authorization'] = `Bearer ${overrideToken}`;
            }

            const fetchOptions: RequestInit = {
                method,
                headers,
                signal: config.signal ?? controller.signal,
            };

            if (body !== undefined) {
                fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body);
            }

            const response = await fetch(fullUrl, fetchOptions);

            if (!response.ok) {
                let errorData: any;
                try {
                    errorData = await response.json();
                } catch {
                    errorData = null;
                }

                // ── 401 Handling: Silently refresh token and retry ──────────────
                if (response.status === 401 && !config.skipAuth && !overrideToken) {
                    if (isRefreshing) {
                        return new Promise<{ data: T; status: number; headers: any }>((resolve, reject) => {
                            failedQueue.push({
                                resolve: (newToken) => doFetch(newToken).then(resolve).catch(reject),
                                reject,
                            });
                        });
                    }

                    isRefreshing = true;

                    try {
                        const refreshToken = await getRefreshToken();
                        if (!refreshToken) {
                            throw makeError('No refresh token available', 401);
                        }

                        const refreshResponse = await fetch(`${API_BASE_URL}${endpoints.auth.refresh}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refreshToken }),
                        });

                        if (!refreshResponse.ok) {
                            throw makeError('Token refresh failed', refreshResponse.status);
                        }

                        const refreshData = await refreshResponse.json();
                        const newAccessToken: string = refreshData.data.token;
                        const newRefreshToken: string = refreshData.data.refreshToken;

                        await setToken(newAccessToken, newRefreshToken);
                        processQueue(null, newAccessToken);

                        return doFetch(newAccessToken);
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        await removeToken();
                        throw makeError('Session expired. Please log in again.', 401);
                    } finally {
                        isRefreshing = false;
                    }
                }

                // ── Other HTTP errors ─────────────────────────────────────────
                throw makeError(
                    errorData?.message || 'Something went wrong',
                    response.status,
                    errorData
                );
            }

            // ── Successful response ─────────────────────────────────────────
            
            // Extract headers as a plain object (Axios compatibility)
            const responseHeaders: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            if (response.status === 204 || response.headers.get('content-length') === '0') {
                return { data: null as unknown as T, status: response.status, headers: responseHeaders };
            }

            let responseData: any;
            if (config.responseType === 'blob') {
                responseData = await response.blob();
            } else if (config.responseType === 'arraybuffer') {
                responseData = await response.arrayBuffer();
            } else if (config.responseType === 'text') {
                responseData = await response.text();
            } else {
                responseData = await response.json();
            }

            return { data: responseData, status: response.status, headers: responseHeaders };
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw makeError('Request timed out. Please try again.', 0);
            }
            if (error && 'status' in error && 'message' in error) {
                throw error;
            }
            throw makeError('Network error. Please check your connection.', 0);
        } finally {
            clearTimeout(timeoutId);
        }
    };

    return doFetch();
};

// ─── Public Client API — Same signature as Axios ──────────────────────────────

export const client = {
    get: <T = any>(url: string, config?: RequestConfig) =>
        request<T>('GET', url, undefined, config),

    post: <T = any>(url: string, data?: any, config?: RequestConfig) =>
        request<T>('POST', url, data, config),

    put: <T = any>(url: string, data?: any, config?: RequestConfig) =>
        request<T>('PUT', url, data, config),

    patch: <T = any>(url: string, data?: any, config?: RequestConfig) =>
        request<T>('PATCH', url, data, config),

    delete: <T = any>(url: string, config?: RequestConfig) =>
        request<T>('DELETE', url, undefined, config),
};
