/**
 * Parses a time string into total minutes from midnight.
 * 
 * Supports both 12-hour (e.g., "09:00 AM", "12:00 PM") and 
 * 24-hour (e.g., "09:00", "13:00", "12:00") formats.
 * 
 * @param timeStr - The time string to parse.
 * @returns Total minutes from midnight (0–1439).
 */
export const parseTimeToMinutes = (timeStr: string): number => {
    const cleanStr = timeStr.trim().toLowerCase();
    const hasAmPm = cleanStr.includes('am') || cleanStr.includes('pm');
    const isPm = cleanStr.includes('pm');
    const digits = cleanStr.replace(/[^0-9:]/g, '');
    const [hStr, mStr] = digits.split(':');
    let hour = parseInt(hStr, 10);
    const minute = parseInt(mStr || '0', 10);

    if (hasAmPm) {
        // 12-hour format: 12 AM = 0, 12 PM = 12, 1 PM = 13, etc.
        if (hour === 12) hour = 0;
        if (isPm) hour += 12;
    }
    // 24-hour format: hour stays as-is (0–23)

    return hour * 60 + minute;
};
