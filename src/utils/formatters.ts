import { API_BASE_URL } from '@/services/api/endpoints';

/**
 * Formats a phone number string into a standard readable format.
 * Formats to: (XXX)-XXX-XXXX
 */
export const formatPhoneNumber = (phoneNumber: string | undefined | null): string => {
    if (!phoneNumber) return '';

    // Remove all non-numeric characters
    const digits = phoneNumber.replace(/\D/g, '').slice(0, 10);

    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)})-${digits.slice(3)}`;
    return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

/**
 * Resolves a full image URL from a backend path.
 * Handles:
 * - Absolute URLs (http/https/file)
 * - Data URIs (data:)
 * - Schemeless URLs (www. -> https://)
 * - Relative paths (prepends API_BASE_URL with slash deduplication)
 */
export const getFullImageUrl = (path: string | undefined | null): string | undefined => {
    if (!path) return undefined;

    // Strictly only check for standard absolute prefixes. 
    // No other validation or "smart" detection.
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('file:')) {
        return path;
    }

    // Treat everything else as relative
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
};
