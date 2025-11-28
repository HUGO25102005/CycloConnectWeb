import { apiService } from "./index";
import type { Command } from "../types/api";

/**
 * Helper class to poll command status until completion or timeout
 */
export class CommandStatusPoller {
    private lockId: string;
    private reqId: string;
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private attempts: number = 0;
    private maxAttempts: number;
    private intervalMs: number;
    private onStatusChange?: (status: string, data: Command) => void;

    constructor(
        lockId: string,
        reqId: string,
        options: {
            maxAttempts?: number;
            intervalMs?: number;
            onStatusChange?: (status: string, data: Command) => void;
        } = {}
    ) {
        this.lockId = lockId;
        this.reqId = reqId;
        this.maxAttempts = options.maxAttempts || 20; // Default 20 attempts
        this.intervalMs = options.intervalMs || 2000; // Default 2s interval
        this.onStatusChange = options.onStatusChange;
    }

    /**
     * Start polling
     * Returns a promise that resolves with the final status data
     */
    start(): Promise<Command> {
        return new Promise((resolve, reject) => {
            // Initial check
            this.checkStatus(resolve, reject);

            // Start interval
            this.intervalId = setInterval(() => {
                this.checkStatus(resolve, reject);
            }, this.intervalMs);
        });
    }

    private async checkStatus(
        resolve: (value: Command) => void,
        reject: (reason?: any) => void
    ) {
        this.attempts++;

        try {
            const response = await apiService.locks.getCommandStatus(this.lockId, this.reqId);

            if (!response.success || !response.data) {
                // If success is false but we have an error, maybe we should fail?
                // Or if it's just a temporary glitch?
                // For now, if explicit error, we fail.
                if (response.error) {
                    throw new Error(response.error);
                }
                // If just no data, maybe wait?
                return;
            }

            const commandData = response.data;

            // Notify status change if callback provided
            if (this.onStatusChange) {
                this.onStatusChange(commandData.status, commandData);
            }

            // Check for terminal states
            if (["completed", "failed", "timeout", "success"].includes(commandData.status)) {
                this.stop();
                if (commandData.status === "completed" || commandData.status === "success") {
                    resolve(commandData);
                } else {
                    reject(new Error(commandData.errorMsg || `Command ${commandData.status}`));
                }
                return;
            }

            // Check for max attempts timeout
            if (this.attempts >= this.maxAttempts) {
                this.stop();
                reject(new Error("Polling timeout: Command took too long"));
            }
        } catch (error) {
            console.warn(`Polling attempt ${this.attempts} failed:`, error);

            if (this.attempts >= this.maxAttempts) {
                this.stop();
                reject(error);
            }
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

/**
 * Robust API call wrapper with retries
 */
export async function robustApiCall<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            lastError = error;
            console.warn(`API call attempt ${attempt} failed:`, error);

            if (attempt < maxRetries) {
                // Exponential backoff
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError;
}
