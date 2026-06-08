import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const isWeb = Platform.OS === 'web';

const setSecureItem = async (key: string, value: string) => {
    if (isWeb) {
        localStorage.setItem(key, value);
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

const getSecureItem = async (key: string): Promise<string | null> => {
    if (isWeb) {
        return localStorage.getItem(key);
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

const deleteSecureItem = async (key: string) => {
    if (isWeb) {
        localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};

interface DecodedToken {
    sub: string;
    userId?: string;
    doctorId?: string;
    role?: string;
    exp: number;
    iat: number;
    [key: string]: any;
}

export const setToken = async (token: string, refreshToken?: string) => {
    await setSecureItem(TOKEN_KEY, token);
    if (refreshToken) {
        await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
    }
};

export const getValidToken = async (skipValidation = false): Promise<string | null> => {
    const token = await getSecureItem(TOKEN_KEY);
    if (!token) return null;

    if (skipValidation) return token;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            await removeToken();
            return null;
        }
        return token;
    } catch {
        return null;
    }
};

export const removeToken = async () => {
    await deleteSecureItem(TOKEN_KEY);
    await deleteSecureItem(REFRESH_TOKEN_KEY);
};

export const getUserFromToken = async () => {
    const token = await getValidToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return {
            id: decoded.userId || decoded.doctorId || '',
            email: decoded.sub,
            role: decoded.role || 'DOCTOR',
        };
    } catch (e) {
        return null;
    }
};

export const getUserId = (token: string): string | null => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.userId || null;
    } catch {
        return null;
    }
};

export const getDoctorId = (token: string): string | null => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.doctorId || null;
    } catch {
        return null;
    }
};

export const getRoleFromToken = async (): Promise<string | null> => {
    const token = await getValidToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.role || null;
    } catch (e) {
        return null;
    }
};
