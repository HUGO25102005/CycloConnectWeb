/**
 * API Services Usage Examples
 *
 * This file demonstrates how to use the API services in your application
 */

import { apiService } from "./index";
import { CommandStatusPoller } from "./api-helpers";
import type { Lock, Command } from "../types/api";

// ==================== LOCKS EXAMPLES ====================

// Get all locks
const fetchAllLocks = async () => {
  try {
    const response = await apiService.locks.getAll();
    if (response.success && response.data) {
      console.log("All locks:", response.data);
      return response.data;
    } else {
      console.error("Failed to fetch locks:", response.error);
    }
  } catch (error) {
    console.error("Error fetching locks:", error);
    throw error;
  }
};

// Get specific lock
const fetchLockById = async (lockId: string) => {
  try {
    const response = await apiService.locks.getById(lockId);
    if (response.success && response.data) {
      console.log("Lock details:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching lock:", error);
    throw error;
  }
};

// Lock a lock with polling
const lockDevice = async (
  lockId: string,
  stationId: string,
  controllerId: string
) => {
  try {
    // 1. Send lock command
    const response = await apiService.locks.lock(lockId, {
      stationId,
      controllerId,
    });

    if (response.success && response.data) {
      const { reqId } = response.data;
      console.log("Lock command sent, reqId:", reqId);

      // 2. Poll for completion
      const poller = new CommandStatusPoller(lockId, reqId, {
        onStatusChange: (status, data) => {
          console.log(`Command status: ${status}`, data);
        },
      });

      const finalResult = await poller.start();
      console.log("Lock operation completed:", finalResult);
      return finalResult;
    }
  } catch (error) {
    console.error("Error locking device:", error);
    throw error;
  }
};

// Unlock a lock with polling
const unlockDevice = async (
  lockId: string,
  stationId: string,
  controllerId: string
) => {
  try {
    // 1. Send unlock command
    const response = await apiService.locks.unlock(lockId, {
      stationId,
      controllerId,
    });

    if (response.success && response.data) {
      const { reqId } = response.data;
      console.log("Unlock command sent, reqId:", reqId);

      // 2. Poll for completion
      const poller = new CommandStatusPoller(lockId, reqId);
      const finalResult = await poller.start();
      console.log("Unlock operation completed:", finalResult);
      return finalResult;
    }
  } catch (error) {
    console.error("Error unlocking device:", error);
    throw error;
  }
};

// ==================== TELEMETRY EXAMPLES ====================

// Get all telemetry data
const fetchTelemetry = async (
  stationId: string,
  controllerId: string,
  lockId: string,
  limit?: number
) => {
  try {
    const response = await apiService.telemetry.getAll({
      stationId,
      controllerId,
      lockId,
      limit,
    });

    if (response.success) {
      console.log("Telemetry data:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching telemetry:", error);
    throw error;
  }
};

// ==================== REACT COMPONENT EXAMPLES ====================

import { useState, useEffect } from "react";

export const LocksListComponent = () => {
  const [locks, setLocks] = useState<Lock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocks = async () => {
      try {
        setLoading(true);
        const response = await apiService.locks.getAll();
        if (response.success && response.data) {
          setLocks(response.data);
        } else {
          setError(response.error || "Failed to load locks");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLocks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Locks List</h1>
      {locks.map((lock) => (
        <div key={lock.id}>
          {lock.position}: {lock.last_state}
        </div>
      ))}
    </div>
  );
};

export const LockControlComponent = ({
  lockId,
  stationId,
  controllerId,
}: {
  lockId: string;
  stationId: string;
  controllerId: string;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleLock = async () => {
    try {
      setIsProcessing(true);
      setStatus("Sending command...");

      const response = await apiService.locks.lock(lockId, {
        stationId,
        controllerId,
      });

      if (response.success && response.data) {
        setStatus("Waiting for device...");
        const poller = new CommandStatusPoller(lockId, response.data.reqId, {
          onStatusChange: (s) => setStatus(`Status: ${s}`),
        });

        await poller.start();
        setStatus("Locked successfully!");
      }
    } catch (error: any) {
      setStatus("Error: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={handleLock} disabled={isProcessing}>
        Lock Device
      </button>
    </div>
  );
};

export default {
  fetchAllLocks,
  fetchLockById,
  lockDevice,
  unlockDevice,
  fetchTelemetry,
};
