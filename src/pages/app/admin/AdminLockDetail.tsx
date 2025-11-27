import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Space,
  Button,
  Spin,
  Descriptions,
  Timeline,
  Typography,
} from "antd";
import { apiService } from "../../../services";
import { useLockCommand } from "../../../hooks/useLockCommand";
import type { Lock, Event, Telemetry } from "../../../types/api";
import {
  LockStatusBadge,
  BatteryIndicator,
  SignalIndicator,
  CommandFeedbackToast,
} from "../../../components/features/locks";
import { Lock as LockIcon, LockOpen, ArrowLeft, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const { Title, Text } = Typography;

export const AdminLockDetail = () => {
  const { lockId } = useParams<{ lockId: string }>();
  const navigate = useNavigate();
  const [lock, setLock] = useState<Lock | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "loading";
  } | null>(null);

  const {
    executeLock,
    executeUnlock,
    isLoading: isCommandLoading,
  } = useLockCommand(lockId || "", {
    onSuccess: () => {
      setToast({ message: "Comando ejecutado exitosamente", type: "success" });
      fetchLockData();
    },
    onError: (error) => {
      setToast({ message: `Error: ${error.message}`, type: "error" });
    },
    onStatusChange: (status) => {
      if (status === "pending") {
        setToast({
          message: "Esperando respuesta del dispositivo...",
          type: "loading",
        });
      }
    },
  });

  const fetchLockData = async () => {
    if (!lockId) return;

    try {
      // First, get the lock data
      const lockRes = await apiService.locks.getById(lockId);

      if (!lockRes.success || !lockRes.data) {
        console.error("Failed to fetch lock data");
        setIsLoading(false);
        return;
      }

      const lockData = lockRes.data;
      setLock(lockData);

      // Now fetch events and telemetry with the lock data
      const [eventsRes, telemetryRes] = await Promise.all([
        apiService.locks.getEvents(lockId, 20),
        apiService.telemetry.getAll({
          stationId: lockData.station_id,
          controllerId: lockData.controller_id,
          lockId,
          limit: 50,
        }),
      ]);

      if (eventsRes.success && eventsRes.data) {
        setEvents(eventsRes.data);
      }
      if (telemetryRes.success && telemetryRes.data) {
        setTelemetry(telemetryRes.data);
      }
    } catch (error) {
      console.error("Error fetching lock data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLockData();
  }, [lockId]);

  const handleLock = async () => {
    if (!lock) return;
    setToast({ message: "Enviando comando...", type: "loading" });
    await executeLock({
      stationId: lock.station_id,
      controllerId: lock.controller_id,
    });
  };

  const handleUnlock = async () => {
    if (!lock) return;
    setToast({ message: "Enviando comando...", type: "loading" });
    await executeUnlock({
      stationId: lock.station_id,
      controllerId: lock.controller_id,
    });
  };

  if (isLoading || !lock) {
    return (
      <div style={{ textAlign: "center", padding: "64px 0" }}>
        <Spin
          size="large"
          indicator={<Activity className="animate-pulse" size={32} />}
        />
        <Text type="secondary" style={{ display: "block", marginTop: 12 }}>
          Cargando datos del candado...
        </Text>
      </div>
    );
  }

  const chartData = telemetry
    .slice()
    .reverse()
    .map((t) => ({
      time: new Date(t.ts).toLocaleTimeString("es-MX", { timeStyle: "short" }),
      battery: t.battery,
      rssi: Math.abs(t.rssi), // Convert to positive for better visualization
    }));

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Header */}
      <Space>
        <Button
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate("/app/admin/dashboard")}
          type="text"
        />
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {lock.position}
          </Title>
          <Text type="secondary">ID: {lock.id}</Text>
        </div>
      </Space>

      {/* Status Panel */}
      <Card title="Estado Actual">
        <Descriptions column={{ xs: 1, sm: 1, md: 3 }}>
          <Descriptions.Item label="Estado">
            <LockStatusBadge status={lock.last_state} size="lg" />
          </Descriptions.Item>
          <Descriptions.Item label="Batería">
            <BatteryIndicator
              level={lock.last_battery}
              showPercentage
              size={24}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Señal">
            <SignalIndicator rssi={lock.last_rssi} showValue size={24} />
          </Descriptions.Item>
        </Descriptions>

        {/* Action Buttons */}
        <Space style={{ marginTop: 24 }}>
          <Button
            type="primary"
            icon={<LockIcon size={20} />}
            onClick={handleLock}
            disabled={isCommandLoading || lock.last_state === "locked"}
            size="large"
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            Bloquear
          </Button>
          <Button
            type="primary"
            icon={<LockOpen size={20} />}
            onClick={handleUnlock}
            disabled={isCommandLoading || lock.last_state === "unlocked"}
            size="large"
            style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
          >
            Desbloquear
          </Button>
        </Space>
      </Card>

      {/* Telemetry Charts */}
      {chartData.length > 0 && (
        <Card title="Telemetría">
          <div style={{ height: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="battery"
                  stroke="#10b981"
                  name="Batería (%)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rssi"
                  stroke="#3b82f6"
                  name="Señal (dBm abs)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Events Timeline */}
      <Card title="Historial de Eventos">
        {events.length === 0 ? (
          <Text type="secondary">No hay eventos registrados</Text>
        ) : (
          <Timeline
            items={events.map((event) => ({
              children: (
                <div>
                  <Space
                    align="start"
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <div>
                      <Text
                        strong
                        style={{
                          color:
                            event.event_type === "locked"
                              ? "#52c41a"
                              : event.event_type === "unlocked"
                                ? "#fa8c16"
                                : "#ff4d4f",
                        }}
                      >
                        {event.event_type === "locked"
                          ? "🔒 Bloqueado"
                          : event.event_type === "unlocked"
                            ? "🔓 Desbloqueado"
                            : "⚠️ Error"}
                      </Text>
                      {event.user_id && (
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Usuario: {event.user_id}
                          </Text>
                        </div>
                      )}
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {new Date(event.ts).toLocaleString("es-MX")}
                        </Text>
                      </div>
                    </div>
                    {event.battery !== undefined && (
                      <BatteryIndicator
                        level={event.battery}
                        showPercentage={false}
                        size={16}
                      />
                    )}
                  </Space>
                </div>
              ),
              color:
                event.event_type === "locked"
                  ? "green"
                  : event.event_type === "unlocked"
                    ? "orange"
                    : "red",
            }))}
          />
        )}
      </Card>

      {/* Toast Notifications */}
      {toast && (
        <CommandFeedbackToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Space>
  );
};
