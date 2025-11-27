/**
 * API Data Models
 * Based on API Documentation v1.0.0
 */

// ==================== LOCKS ====================

/**
 * Firestore Timestamp structure
 */
export interface FirestoreTimestamp {
    _seconds: number;
    _nanoseconds: number;
}

/**
 * Lock data structure from API
 */
export interface Lock {
    id: string;
    station_id: string;
    controller_id: string;
    last_seq: number;
    last_state: "locked" | "unlocked" | "unknown";
    last_battery: number; // 0-100
    last_rssi: number; // Signal strength in dBm
    updated_at: FirestoreTimestamp;
    // Optional fields that might not be in the API response
    position?: string;
    controller_status?: "online" | "offline";
    last_update?: number; // For compatibility
}

export interface Command {
    reqId: string;              // Unique command ID
    cmd: "lock" | "unlock" | "reboot"; // Command type
    status: "sent" | "pending" | "completed" | "failed" | "timeout";
    requestedAt: number;        // Request timestamp
    resolvedAt: number | null;  // Resolution timestamp
    errorMsg: string | null;    // Error message if failed
}

export interface Event {
    id: string;                 // Unique event ID
    lock_id: string;            // Lock ID
    event_type: "locked" | "unlocked" | "error"; // Event type
    ts: number;                 // Event timestamp
    user_id?: string;           // User who triggered the event
    battery?: number;           // Battery level at event time
    rssi?: number;              // Signal strength at event time
}

export interface Telemetry {
    id: string;                 // Unique record ID
    battery: number;            // Battery level 0-100
    rssi: number;               // Signal strength in dBm
    temperature?: number;       // Temperature in °C
    uptime?: number;            // Uptime in ms
    ts: number;                 // Record timestamp
}

export interface Log {
    id: string;                 // Unique log ID
    type: string;               // Log type
    message: string;            // Log message
    severity: "info" | "warning" | "error"; // Severity level
    ts: number;                 // Timestamp
    data?: any;                 // Additional data
}

// Response Wrappers
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    count?: number;
    stationId?: string;
    controllerId?: string;
    lockId?: string;
}

export interface CommandResponse {
    reqId: string;
    statusUrl: string;
}
