import { useState, useCallback, useRef, useEffect } from "react";
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

    // Use refs to store callbacks to avoid recreating functions
    const optionsRef = useRef(options);

    // Update ref when options change
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const executeLock = useCallback(
        async (params: LockCommandParams) => {
            setIsLoading(true);
            setError(null);
            setCurrentStatus("sending");

            try {
                console.log("🔒 Sending lock command for lockId:", lockId);
                // Send lock command
                const response = await apiService.locks.lock(lockId, params);

                if (!response.success || !response.data) {
                    throw new Error(response.error || "Failed to send lock command");
                }

                const { reqId } = response.data;
                console.log("✅ Lock command sent, reqId:", reqId);
                setCurrentStatus("polling");

                // Start polling for command status
                const poller = new CommandStatusPoller(lockId, reqId, {
                    maxAttempts: 20,
                    intervalMs: 2000,
                    onStatusChange: (status, data) => {
                        console.log("📊 Lock command status:", status);
                        setCurrentStatus(status);
                        optionsRef.current.onStatusChange?.(status, data);
                    },
                });

                const result = await poller.start();
                console.log("🎉 Lock command completed successfully");
                setCurrentStatus("completed");
                optionsRef.current.onSuccess?.(result);
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Unknown error");
                console.error("❌ Lock command failed:", error);
                setError(error);
                setCurrentStatus("failed");
                optionsRef.current.onError?.(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [lockId] // Only lockId as dependency
    );

    const executeUnlock = useCallback(
        async (params: LockCommandParams) => {
            setIsLoading(true);
            setError(null);
            setCurrentStatus("sending");

            try {
                console.log("🔓 Sending unlock command for lockId:", lockId);
                // Send unlock command
                const response = await apiService.locks.unlock(lockId, params);

                if (!response.success || !response.data) {
                    throw new Error(response.error || "Failed to send unlock command");
                }

                const { reqId } = response.data;
                console.log("✅ Unlock command sent, reqId:", reqId);
                setCurrentStatus("polling");

                // Start polling for command status
                const poller = new CommandStatusPoller(lockId, reqId, {
                    maxAttempts: 20,
                    intervalMs: 2000,
                    onStatusChange: (status, data) => {
                        console.log("📊 Unlock command status:", status);
                        setCurrentStatus(status);
                        optionsRef.current.onStatusChange?.(status, data);
                    },
                });

                const result = await poller.start();
                console.log("🎉 Unlock command completed successfully");
                setCurrentStatus("completed");
                optionsRef.current.onSuccess?.(result);
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Unknown error");
                console.error("❌ Unlock command failed:", error);
                setError(error);
                setCurrentStatus("failed");
                optionsRef.current.onError?.(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [lockId] // Only lockId as dependency
    );

    return {
        executeLock,
        executeUnlock,
        isLoading,
        error,
        currentStatus,
    };
};
