/**
 * Formats a phone number string into a standard readable format.
 * Formats to: (XXX)-XXX-XXXX
 */
export const formatPhoneNumber = (phoneNumber: string | undefined | null): string => {
    if (!phoneNumber) return 'N/A';

    // Remove all non-numeric characters
    const digits = phoneNumber.replace(/\D/g, '');

    if (digits.length === 10) {
        return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    if (digits.length === 11 && digits.startsWith('1')) {
        return `(${digits.slice(1, 4)})-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    // Fallback for other lengths (like Indian 12-digit)
    if (digits.length === 12 && digits.startsWith('91')) {
        return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
    }

    return phoneNumber;
};


