/**
 * API Data Models
 * Based on API Documentation v1.0.0
 */

export interface Lock {
    id: string;                 // Unique lock ID
    station_id: string;         // Station ID
    controller_id: string;      // Controller ID
    position: string;           // Physical position (e.g., "A1")
    last_state: "locked" | "unlocked" | "unknown"; // Last known state
    last_battery: number;       // Battery level 0-100
    last_rssi: number;          // Signal strength in dBm
    last_update: number;        // Timestamp in ms
    controller_status: "online" | "offline"; // Controller status
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
