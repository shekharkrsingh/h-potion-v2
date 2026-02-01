import { client, ApiResponse } from '../api/client';
import { endpoints } from '../api/endpoints';
import { setToken, removeToken } from './tokenService';

export interface LoginPayload {
    username: string; // The backend uses 'username' for email in login
    password: string;
}

export interface LoginResponseData {
    token: string;
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
        if (token) {
            await setToken(token);
        }
        return token;
    },

    logout: async () => {
        await removeToken();
    },

    register: async (payload: SignupPayload): Promise<string | undefined> => {
        const response = await client.post<ApiResponse<LoginResponseData>>(endpoints.auth.signup, payload, { skipAuth: true });
        const token = response.data.data?.token;
        if (token) {
            await setToken(token);
        }
        return token;
    },

    verify: async (payload: VerifyPayload): Promise<string> => {
        const response = await client.post<ApiResponse<LoginResponseData>>(endpoints.auth.verify, payload, { skipAuth: true });
        const token = response.data.data.token;
        if (token) {
            await setToken(token);
        }
        return token;
    },

    resendOtp: async (email: string): Promise<void> => {
        await client.post<ApiResponse<null>>(endpoints.auth.sendOtp, { email }, { skipAuth: true });
    },

    forgotPassword: async (email: string, newPassword: string, otp: string): Promise<void> => {
        await client.post<ApiResponse<null>>(endpoints.auth.forgotPassword, { email, newPassword, otp }, { skipAuth: true });
    },

    getUserFromToken: async () => {
        const { getUserFromToken } = require('./tokenService');
        return await getUserFromToken();
    },
    getValidToken: async () => {
        const { getValidToken } = require('./tokenService');
        return await getValidToken();
    },

    changePassword: async (password: string, newPassword: string): Promise<void> => {
        await client.post(endpoints.doctor.changePassword, { oldPassword: password, newPassword });
    },

    updateEmail: async (newEmail: string, otp: string, password: string): Promise<void> => {
        await client.post(endpoints.doctor.updateEmail, { newEmail, otp, password });
    }
};
