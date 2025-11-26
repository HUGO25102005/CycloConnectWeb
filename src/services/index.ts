import axios from "axios";

// Base API URL - update this with your actual API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ==================== TYPES ====================

export interface Lock {
    lockId: string;
    last_state?: string;
    last_battery?: number;
    last_rssi?: number;
    position?: number;
}

export interface CommandStatus {
    req_id: string;
    status: string;
    error_msg?: string;
    ts_requested?: string;
    ts_resolved?: string;
}

export interface TelemetryData {
    stationId: string;
    controllerId: string;
    lockId: string;
    count: number;
    data: any[];
}

export interface LogData {
    stationId: string;
    controllerId: string;
    lockId: string;
    count: number;
    data: any[];
}

export interface CommandRequest {
    stationId: string;
    controllerId: string;
    lockId: string;
    cmd: string;
    timeoutMs?: number;
}

// ==================== LOCKS SERVICES ====================

export const locksService = {
    /**
     * Get all locks
     */
    getAll: async () => {
        const response = await api.get("/locks");
        return response.data;
    },

    /**
     * Get lock by ID
     */
    getById: async (lockId: string) => {
        const response = await api.get(`/locks/${lockId}`);
        return response.data;
    },

    /**
     * Lock a specific lock
     */
    lock: async (lockId: string) => {
        const response = await api.post(`/locks/${lockId}/lock`);
        return response.data;
    },

    /**
     * Unlock a specific lock
     */
    unlock: async (lockId: string) => {
        const response = await api.post(`/locks/${lockId}/unlock`);
        return response.data;
    },

    /**
     * Get command status for a lock
     */
    getCommandStatus: async (lockId: string, reqId: string): Promise<CommandStatus> => {
        const response = await api.get(`/locks/${lockId}/status/${reqId}`);
        return response.data;
    },

    /**
     * Get events for a specific lock
     */
    getEvents: async (lockId: string) => {
        const response = await api.get(`/locks/${lockId}/events`);
        return response.data;
    },
};

// ==================== COMMANDS SERVICES ====================

export const commandsService = {
    /**
     * Publish a command to a lock
     */
    publish: async (lockId: string, commandData: any) => {
        const response = await api.post(`/commands/${lockId}`, commandData);
        return response.data;
    },

    /**
     * Get command status by command ID
     */
    getStatus: async (commandId: string): Promise<CommandStatus> => {
        const response = await api.get(`/commands/status/${commandId}`);
        return response.data;
    },

    /**
     * Get command details by request ID (legacy)
     */
    getById: async (reqId: string): Promise<CommandStatus> => {
        const response = await api.get(`/commands/${reqId}`);
        return response.data;
    },
};

// ==================== TELEMETRY SERVICES ====================

export const telemetryService = {
    /**
     * Get all telemetry data for a specific lock
     */
    getAll: async (params: {
        stationId: string;
        controllerId: string;
        lockId: string;
        limit?: number;
    }): Promise<TelemetryData> => {
        const response = await api.get("/telemetry", { params });
        return response.data;
    },

    /**
     * Get specific telemetry by ID
     */
    getById: async (
        telemetryId: string,
        params: {
            stationId: string;
            controllerId: string;
            lockId: string;
        }
    ) => {
        const response = await api.get(`/telemetry/${telemetryId}`, { params });
        return response.data;
    },
};

// ==================== LOGS SERVICES ====================

export const logsService = {
    /**
     * Get all logs for a specific lock
     */
    getAll: async (params: {
        stationId: string;
        controllerId: string;
        lockId: string;
        limit?: number;
    }): Promise<LogData> => {
        const response = await api.get("/logs", { params });
        return response.data;
    },

    /**
     * Get specific log by ID
     */
    getById: async (
        logId: string,
        params: {
            stationId: string;
            controllerId: string;
            lockId: string;
        }
    ) => {
        const response = await api.get(`/logs/${logId}`, { params });
        return response.data;
    },
};

// ==================== LEGACY/CONTROLLERS SERVICES ====================

export const controllersService = {
    /**
     * Get all locks for a specific controller
     */
    getLocks: async (controllerId: string, stationId: string): Promise<Lock[]> => {
        const response = await api.get(`/controllers/${controllerId}/locks`, {
            params: { stationId },
        });
        return response.data;
    },

    /**
     * Send command to a specific lock via station/controller/lock path
     */
    sendCommand: async (
        stationId: string,
        controllerId: string,
        lockId: string,
        cmd: string,
        timeoutMs: number = 5000
    ) => {
        const response = await api.post(
            `/stations/${stationId}/controllers/${controllerId}/locks/${lockId}/${cmd}`,
            { timeoutMs }
        );
        return response.data;
    },
};

// ==================== METRICS SERVICES ====================

export const metricsService = {
    /**
     * Get Prometheus metrics
     */
    getMetrics: async () => {
        const response = await api.get("/metrics");
        return response.data;
    },
};

// ==================== COMBINED SERVICE ====================

/**
 * Main API service object that exports all services
 */
export const apiService = {
    locks: locksService,
    commands: commandsService,
    telemetry: telemetryService,
    logs: logsService,
    controllers: controllersService,
    metrics: metricsService,
};

// Export default axios instance for custom requests
export default api;
