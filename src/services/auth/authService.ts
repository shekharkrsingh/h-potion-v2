import { client, ApiResponse } from '../api/client';
import { endpoints } from '../api/endpoints';
import { setToken, removeToken, getRefreshToken, getUserFromToken, getValidToken } from './tokenService';

export interface LoginPayload {
    username: string; // The backend uses 'username' for email in login
    password: string;
}

export interface LoginResponseData {
    token: string;
    refreshToken?: string;
    user?: any;
}

export interface SignupPayload {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    otp?: string;
}

export interface VerifyPayload {
    email: string;
    otp: string;
}

export const AuthService = {
    login: async (payload: LoginPayload): Promise<string> => {
        const response = await client.post<ApiResponse<LoginResponseData>>(endpoints.auth.login, payload, { skipAuth: true });
        const token = response.data.data.token;
        const refreshToken = response.data.data.refreshToken;
        if (token) {
            await setToken(token, refreshToken);
        }
        return token;
    },

    logout: async () => {
        try {
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
                await client.post(endpoints.auth.logout, { refreshToken }, { skipAuth: true });
            }
        } catch (e) {
            // ignore network errors on logout
        } finally {
            await removeToken();
        }
    },

    register: async (payload: SignupPayload): Promise<string | undefined> => {
        const response = await client.post<ApiResponse<LoginResponseData>>(endpoints.auth.signup, payload, { skipAuth: true });
        const token = response.data.data?.token;
        const refreshToken = response.data.data?.refreshToken;
        if (token) {
            await setToken(token, refreshToken);
        }
        return token;
    },

    verify: async (payload: VerifyPayload): Promise<string> => {
        const response = await client.post<ApiResponse<LoginResponseData>>(endpoints.auth.verify, payload, { skipAuth: true });
        const token = response.data.data.token;
        const refreshToken = response.data.data.refreshToken;
        if (token) {
            await setToken(token, refreshToken);
        }
        return token;
    },

    refreshTokens: async (refreshToken: string): Promise<string> => {
        const response = await client.post<ApiResponse<LoginResponseData>>(endpoints.auth.refresh, { refreshToken }, { skipAuth: true });
        const newToken = response.data.data.token;
        const newRefreshToken = response.data.data.refreshToken;
        if (newToken) {
            await setToken(newToken, newRefreshToken);
        }
        return newToken;
    },

    resendOtp: async (email: string): Promise<void> => {
        await client.post<ApiResponse<null>>(endpoints.auth.sendOtp, { email }, { skipAuth: true });
    },

    forgotPassword: async (email: string, newPassword: string, otp: string): Promise<void> => {
        await client.post<ApiResponse<null>>(endpoints.auth.forgotPassword, { email, newPassword, otp }, { skipAuth: true });
    },

    getUserFromToken: async () => {
        return await getUserFromToken();
    },
    getValidToken: async () => {
        return await getValidToken();
    },

    changePassword: async (password: string, newPassword: string): Promise<void> => {
        await client.post(endpoints.doctor.changePassword, { oldPassword: password, newPassword });
    },

    updateEmail: async (newEmail: string, otp: string, password: string): Promise<void> => {
        const response = await client.post<ApiResponse<LoginResponseData>>(endpoints.doctor.updateEmail, { newEmail, otp, password });
        const token = response.data.data?.token;
        const refreshToken = response.data.data?.refreshToken;
        if (token) {
            await setToken(token, refreshToken);
        }
    }
};
