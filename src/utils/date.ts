/**
 * Formats a date string, Java-style date array [yyyy, mm, dd], or timestamp into a localized string.
 * @param dateInput - The date input to format (ISO string, array, or numeric timestamp).
 * @param options   - Optional Intl.DateTimeFormatOptions for custom formatting.
 * @returns A localized date string or 'N/A'.
 */
export const formatDate = (
    dateInput: any,
    options?: Intl.DateTimeFormatOptions
): string => {
    if (!dateInput) return 'N/A';

    try {
        let date: Date;

        // Handle Java array format [yyyy, mm, dd, ...]
        if (Array.isArray(dateInput)) {
            date = new Date(dateInput[0], dateInput[1] - 1, dateInput[2]);
        } else {
            date = new Date(dateInput);
        }

        if (isNaN(date.getTime())) return 'N/A';

        return options
            ? date.toLocaleDateString(undefined, options)
            : date.toLocaleDateString();
    } catch (e) {
        console.error('Date formatting error:', e);
        return 'N/A';
    }
};
