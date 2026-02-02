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


