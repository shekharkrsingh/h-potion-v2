import { Platform } from 'react-native';

/**
 * Converts a Uint8Array to a Base64 string.
 * This implementation handles large files by processing in chunks to avoid stack overflow.
 */
export const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
    try {
        let binary = "";
        const len = bytes.byteLength;
        const chunk = 8192; // Chunking avoids stack overflow on large files
        for (let i = 0; i < len; i += chunk) {
            // @ts-ignore
            binary += String.fromCharCode.apply(null, Array.from(bytes.slice(i, i + chunk)));
        }
        return btoa(binary);
    } catch (e) {
        console.error('Base64 conversion error:', e);
        throw new Error('Failed to process file data for mobile storage');
    }
};
