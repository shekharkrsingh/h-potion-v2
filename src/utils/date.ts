/**
 * Formats a date string or Java-style date array [yyyy, mm, dd] into a localized string.
 * @param dateInput - The date input to format.
 * @returns A localized date string or 'Unknown Date'.
 */
export const formatDate = (dateInput: any): string => {
    if (!dateInput) return 'Unknown Date';

    try {
        // Handle array format [yyyy, mm, dd, ...] common in Java/Spring responses
        if (Array.isArray(dateInput)) {
            // new Date(year, monthIndex, day) -> month is 0-indexed in JS
            const date = new Date(dateInput[0], dateInput[1] - 1, dateInput[2]);
            return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
        }

        // Handle standard string/timestamp
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString();
    } catch (e) {
        console.error("Date formatting error:", e);
        return 'Invalid Date';
    }
};
