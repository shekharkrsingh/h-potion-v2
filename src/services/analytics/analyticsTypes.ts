/**
 * ========================================
 * ANALYTICS MODULE - TYPESCRIPT TYPES
 * ========================================
 */

/**
 * Device metadata collected from the device
 */
export interface DeviceMetadata {
    platform: string;
    osVersion: string;
    appVersion: string;
    deviceManufacturer: string | null;
    deviceModel: string | null;
    deviceBrand: string | null;
    screenWidth: number;
    screenHeight: number;
    networkType: string;
    timezone: string;
}

/**
 * Analytics DTO sent to backend
 * Must match backend AnalyticsDTO.java
 */
export interface AnalyticsDTO {
    platform: string;
    osVersion: string;
    appVersion: string;
    deviceManufacturer?: string;
    deviceModel?: string;
    deviceBrand?: string;
    screenWidth: number;
    screenHeight: number;
    networkType: string;
    timezone: string;
    latitude?: number;
    longitude?: number;
}

/**
 * Local storage structure for analytics flag
 */
export interface AnalyticsStorageData {
    lastSentDate: string; // ISO date string (YYYY-MM-DD)
}
