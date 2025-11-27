import { useState, useCallback } from "react";
import { apiService } from "../services";
import { CommandStatusPoller } from "../services/api-helpers";
import type { Command } from "../types/api";

interface UseLockCommandOptions {
    onSuccess?: (data: Command) => void;
    onError?: (error: Error) => void;
    onStatusChange?: (status: string, data: Command) => void;
}

interface LockCommandParams {
    stationId: string;
    controllerId: string;
    timeoutMs?: number;
}

export const useLockCommand = (lockId: string, options: UseLockCommandOptions = {}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [currentStatus, setCurrentStatus] = useState<string | null>(null);

    const executeLock = useCallback(
        async (params: LockCommandParams) => {
            setIsLoading(true);
            setError(null);
            setCurrentStatus("sending");

            try {
                // Send lock command
                const response = await apiService.locks.lock(lockId, params);

                if (!response.success || !response.data) {
                    throw new Error(response.error || "Failed to send lock command");
                }

                const { reqId } = response.data;
                setCurrentStatus("polling");

                // Start polling for command status
                const poller = new CommandStatusPoller(lockId, reqId, {
                    maxAttempts: 20,
                    intervalMs: 2000,
                    onStatusChange: (status, data) => {
                        setCurrentStatus(status);
                        options.onStatusChange?.(status, data);
                    },
                });

                const result = await poller.start();
                setCurrentStatus("completed");
                options.onSuccess?.(result);
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Unknown error");
                setError(error);
                setCurrentStatus("failed");
                options.onError?.(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [lockId, options]
    );

    const executeUnlock = useCallback(
        async (params: LockCommandParams) => {
            setIsLoading(true);
            setError(null);
            setCurrentStatus("sending");

            try {
                // Send unlock command
                const response = await apiService.locks.unlock(lockId, params);

                if (!response.success || !response.data) {
                    throw new Error(response.error || "Failed to send unlock command");
                }

                const { reqId } = response.data;
                setCurrentStatus("polling");

                // Start polling for command status
                const poller = new CommandStatusPoller(lockId, reqId, {
                    maxAttempts: 20,
                    intervalMs: 2000,
                    onStatusChange: (status, data) => {
                        setCurrentStatus(status);
                        options.onStatusChange?.(status, data);
                    },
                });

                const result = await poller.start();
                setCurrentStatus("completed");
                options.onSuccess?.(result);
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Unknown error");
                setError(error);
                setCurrentStatus("failed");
                options.onError?.(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [lockId, options]
    );

    return {
        executeLock,
        executeUnlock,
        isLoading,
        error,
        currentStatus,
    };
};
