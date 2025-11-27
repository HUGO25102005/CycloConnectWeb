import axios from "axios";
import type {
    Lock,
    Command,
    Event,
    Telemetry,
    Log,
    ApiResponse,
    CommandResponse,
    PaginatedResponse
} from "../types/api";

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ==================== LOCKS SERVICES ====================

export const locksService = {
    /**
     * Get all locks
     * GET /api/locks
     */
    getAll: async (): Promise<ApiResponse<Lock[]>> => {
        const response = await api.get("/locks");
        return response.data;
    },

    /**
     * Get lock by ID
     * GET /api/locks/:lockId
     */
    getById: async (lockId: string): Promise<ApiResponse<Lock>> => {
        const response = await api.get(`/locks/${lockId}`);
        return response.data;
    },

    /**
     * Lock a specific lock
     * POST /api/locks/:lockId/lock
     */
    lock: async (
        lockId: string,
        params: { stationId: string; controllerId: string; timeoutMs?: number }
    ): Promise<ApiResponse<CommandResponse>> => {
        const response = await api.post(`/locks/${lockId}/lock`, params);
        return response.data;
    },

    /**
     * Unlock a specific lock
     * POST /api/locks/:lockId/unlock
     */
    unlock: async (
        lockId: string,
        params: { stationId: string; controllerId: string; timeoutMs?: number }
    ): Promise<ApiResponse<CommandResponse>> => {
        const response = await api.post(`/locks/${lockId}/unlock`, params);
        return response.data;
    },

    /**
     * Get command status
     * GET /api/locks/:lockId/status/:reqId
     */
    getCommandStatus: async (lockId: string, reqId: string): Promise<ApiResponse<Command>> => {
        const response = await api.get(`/locks/${lockId}/status/${reqId}`);
        return response.data;
    },

    /**
     * Get events for a specific lock
     * GET /api/locks/:lockId/events
     */
    getEvents: async (lockId: string, limit: number = 50): Promise<ApiResponse<Event[]>> => {
        const response = await api.get(`/locks/${lockId}/events`, {
            params: { limit }
        });
        return response.data;
    },
};

// ==================== COMMANDS SERVICES (MODERN) ====================

export const commandsService = {
    /**
     * Publish a command
     * POST /api/commands/:lockId
     */
    publish: async (
        lockId: string,
        data: {
            stationId: string;
            controllerId: string;
            action: "open" | "close";
            requestedBy?: string
        }
    ) => {
        const response = await api.post(`/commands/${lockId}`, data);
        return response.data;
    },

    /**
     * Get command status (Modern)
     * GET /api/commands/status/:commandId
     */
    getStatus: async (commandId: string) => {
        const response = await api.get(`/commands/status/${commandId}`);
        return response.data;
    },
};

// ==================== TELEMETRY SERVICES ====================

export const telemetryService = {
    /**
     * Get telemetry data
     * GET /api/telemetry
     */
    getAll: async (params: {
        stationId: string;
        controllerId: string;
        lockId: string;
        limit?: number;
    }): Promise<PaginatedResponse<Telemetry>> => {
        const response = await api.get("/telemetry", { params } );
        return response.data;
    },

    /**
     * Get specific telemetry by ID
     * GET /api/telemetry/:telemetryId
     */
    getById: async (
        telemetryId: string,
        params: {
            stationId: string;
            controllerId: string;
            lockId: string;
        }
    ): Promise<Telemetry> => {
        const response = await api.get(`/telemetry/${telemetryId}`, { params });
        return response.data;
    },
};

// ==================== LOGS SERVICES ====================

export const logsService = {
    /**
     * Get logs
     * GET /api/logs
     */
    getAll: async (params: {
        stationId: string;
        controllerId: string;
        lockId: string;
        limit?: number;
    }): Promise<PaginatedResponse<Log>> => {
        const response = await api.get("/logs", { params });
        return response.data;
    },

    /**
     * Get specific log by ID
     * GET /api/logs/:logId
     */
    getById: async (
        logId: string,
        params: {
            stationId: string;
            controllerId: string;
            lockId: string;
        }
    ): Promise<Log> => {
        const response = await api.get(`/logs/${logId}`, { params });
        return response.data;
    },
};

// ==================== METRICS SERVICES ====================

export const metricsService = {
    /**
     * Get Prometheus metrics
     * GET /api/metrics
     */
    getMetrics: async () => {
        const response = await api.get("/metrics");
        return response.data;
    },
};

// ==================== COMBINED SERVICE ====================

export const apiService = {
    locks: locksService,
    commands: commandsService,
    telemetry: telemetryService,
    logs: logsService,
    metrics: metricsService,
};

export default api;
