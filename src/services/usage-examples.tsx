/**
 * API Services Usage Examples
 *
 * This file demonstrates how to use the API services in your application
 */

import {
  apiService,
} from "./index";

// ==================== LOCKS EXAMPLES ====================

// Get all locks
const fetchAllLocks = async () => {
  try {
    const locks = await apiService.locks.getAll();
    console.log("All locks:", locks);
    return locks;
  } catch (error) {
    console.error("Error fetching locks:", error);
    throw error;
  }
};

// Get specific lock
const fetchLockById = async (lockId: string) => {
  try {
    const lock = await apiService.locks.getById(lockId);
    console.log("Lock details:", lock);
    return lock;
  } catch (error) {
    console.error("Error fetching lock:", error);
    throw error;
  }
};

// Lock a lock
const lockDevice = async (lockId: string) => {
  try {
    const result = await apiService.locks.lock(lockId);
    console.log("Lock result:", result);
    return result;
  } catch (error) {
    console.error("Error locking device:", error);
    throw error;
  }
};

// Unlock a lock
const unlockDevice = async (lockId: string) => {
  try {
    const result = await apiService.locks.unlock(lockId);
    console.log("Unlock result:", result);
    return result;
  } catch (error) {
    console.error("Error unlocking device:", error);
    throw error;
  }
};

// Get command status
const checkCommandStatus = async (lockId: string, reqId: string) => {
  try {
    const status = await apiService.locks.getCommandStatus(lockId, reqId);
    console.log("Command status:", status);
    return status;
  } catch (error) {
    console.error("Error getting command status:", error);
    throw error;
  }
};

// Get lock events
const fetchLockEvents = async (lockId: string) => {
  try {
    const events = await apiService.locks.getEvents(lockId);
    console.log("Lock events:", events);
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// ==================== COMMANDS EXAMPLES ====================

// Publish a command
const publishCommand = async (lockId: string, commandData: any) => {
  try {
    const result = await apiService.commands.publish(lockId, commandData);
    console.log("Command published:", result);
    return result;
  } catch (error) {
    console.error("Error publishing command:", error);
    throw error;
  }
};

// Get command status by ID
const getCommandStatus = async (commandId: string) => {
  try {
    const status = await apiService.commands.getStatus(commandId);
    console.log("Command status:", status);
    return status;
  } catch (error) {
    console.error("Error getting command status:", error);
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
    const telemetry = await apiService.telemetry.getAll({
      stationId,
      controllerId,
      lockId,
      limit,
    });
    console.log("Telemetry data:", telemetry);
    return telemetry;
  } catch (error) {
    console.error("Error fetching telemetry:", error);
    throw error;
  }
};

// Get specific telemetry by ID
const fetchTelemetryById = async (
  telemetryId: string,
  stationId: string,
  controllerId: string,
  lockId: string
) => {
  try {
    const telemetry = await apiService.telemetry.getById(telemetryId, {
      stationId,
      controllerId,
      lockId,
    });
    console.log("Telemetry details:", telemetry);
    return telemetry;
  } catch (error) {
    console.error("Error fetching telemetry:", error);
    throw error;
  }
};

// ==================== LOGS EXAMPLES ====================

// Get all logs
const fetchLogs = async (
  stationId: string,
  controllerId: string,
  lockId: string,
  limit?: number
) => {
  try {
    const logs = await apiService.logs.getAll({
      stationId,
      controllerId,
      lockId,
      limit,
    });
    console.log("Logs data:", logs);
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
};

// Get specific log by ID
const fetchLogById = async (
  logId: string,
  stationId: string,
  controllerId: string,
  lockId: string
) => {
  try {
    const log = await apiService.logs.getById(logId, {
      stationId,
      controllerId,
      lockId,
    });
    console.log("Log details:", log);
    return log;
  } catch (error) {
    console.error("Error fetching log:", error);
    throw error;
  }
};

// ==================== CONTROLLERS EXAMPLES ====================

// Get locks for a controller
const fetchControllerLocks = async (
  controllerId: string,
  stationId: string
) => {
  try {
    const locks = await apiService.controllers.getLocks(
      controllerId,
      stationId
    );
    console.log("Controller locks:", locks);
    return locks;
  } catch (error) {
    console.error("Error fetching controller locks:", error);
    throw error;
  }
};

// Send command via station/controller/lock path
const sendLegacyCommand = async (
  stationId: string,
  controllerId: string,
  lockId: string,
  cmd: string,
  timeoutMs: number = 5000
) => {
  try {
    const result = await apiService.controllers.sendCommand(
      stationId,
      controllerId,
      lockId,
      cmd,
      timeoutMs
    );
    console.log("Command result:", result);
    return result;
  } catch (error) {
    console.error("Error sending command:", error);
    throw error;
  }
};

// ==================== REACT COMPONENT EXAMPLES ====================

// Example React component using the services
import { useState, useEffect } from "react";

export const LocksListComponent = () => {
  const [locks, setLocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLocks = async () => {
      try {
        setLoading(true);
        const data = await apiService.locks.getAll();
        setLocks(data);
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
      {/* Render locks here */}
    </div>
  );
};

// Example with lock/unlock actions
export const LockControlComponent = ({ lockId }: { lockId: string }) => {
  const [isLocking, setIsLocking] = useState(false);

  const handleLock = async () => {
    try {
      setIsLocking(true);
      await apiService.locks.lock(lockId);
      alert("Lock successful!");
    } catch (error: any) {
      alert("Error locking: " + error.message);
    } finally {
      setIsLocking(false);
    }
  };

  const handleUnlock = async () => {
    try {
      setIsLocking(true);
      await apiService.locks.unlock(lockId);
      alert("Unlock successful!");
    } catch (error: any) {
      alert("Error unlocking: " + error.message);
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <div>
      <button onClick={handleLock} disabled={isLocking}>
        Lock
      </button>
      <button onClick={handleUnlock} disabled={isLocking}>
        Unlock
      </button>
    </div>
  );
};

export default {
  fetchAllLocks,
  fetchLockById,
  lockDevice,
  unlockDevice,
  checkCommandStatus,
  fetchLockEvents,
  publishCommand,
  getCommandStatus,
  fetchTelemetry,
  fetchTelemetryById,
  fetchLogs,
  fetchLogById,
  fetchControllerLocks,
  sendLegacyCommand,
};
