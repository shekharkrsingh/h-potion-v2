import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

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

/**
 * Lightweight JWT decoder — replaces the `jwt-decode` package.
 * A JWT is three base64url-encoded segments separated by dots.
 * The second segment (index 1) is the JSON payload.
 * Pure JS implementation for React Native / Hermes compatibility.
 */
const decodeJwt = (token: string): DecodedToken => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) throw new Error('Invalid JWT structure');
        
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Pad to multiple of 4
        while (base64.length % 4) {
            base64 += '=';
        }

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let binaryStr = '';
        for (let i = 0; i < base64.length; i++) {
            if (base64[i] === '=') break;
            const idx = chars.indexOf(base64[i]);
            if (idx === -1) continue;
            const bin = idx.toString(2).padStart(6, '0');
            binaryStr += bin;
        }

        let utf8String = '';
        for (let i = 0; i < binaryStr.length; i += 8) {
            const byte = binaryStr.substring(i, i + 8);
            if (byte.length === 8) {
                utf8String += String.fromCharCode(parseInt(byte, 2));
            }
        }

        // Decode UTF-8 string properly
        const jsonPayload = decodeURIComponent(
            utf8String.split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        throw new Error('Failed to decode JWT token');
    }
};

let memoryToken: string | null = null;
let memoryRefreshToken: string | null = null;

export const setToken = async (token: string, refreshToken?: string) => {
    memoryToken = token;
    await setSecureItem(TOKEN_KEY, token);
    if (refreshToken) {
        memoryRefreshToken = refreshToken;
        await setSecureItem(REFRESH_TOKEN_KEY, refreshToken);
    }
};

export const getRefreshToken = async (): Promise<string | null> => {
    return memoryRefreshToken || await getSecureItem(REFRESH_TOKEN_KEY);
};

export const getValidToken = async (skipValidation = false): Promise<string | null> => {
    const token = memoryToken || await getSecureItem(TOKEN_KEY);
    if (!token) return null;

    if (skipValidation) return token;

    try {
        const decoded = decodeJwt(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            // Access token expired — only clear the access token, NOT the refresh token.
            // The interceptor will use the refresh token to silently renew.
            memoryToken = null;
            await deleteSecureItem(TOKEN_KEY);
            return null;
        }
        return token;
    } catch {
        return null;
    }
};

export const removeToken = async () => {
    memoryToken = null;
    memoryRefreshToken = null;
    await deleteSecureItem(TOKEN_KEY);
    await deleteSecureItem(REFRESH_TOKEN_KEY);
};

export const getUserFromToken = async () => {
    const token = await getValidToken();
    if (!token) return null;
    try {
        const decoded = decodeJwt(token);
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
        const decoded = decodeJwt(token);
        return decoded.userId || null;
    } catch {
        return null;
    }
};

export const getDoctorId = (token: string): string | null => {
    try {
        const decoded = decodeJwt(token);
        return decoded.doctorId || null;
    } catch {
        return null;
    }
};

export const getRoleFromToken = async (): Promise<string | null> => {
    const token = await getValidToken();
    if (!token) return null;
    try {
        const decoded = decodeJwt(token);
        return decoded.role || null;
    } catch (e) {
        return null;
    }
};
