import { useState, useEffect } from "react";
import {
  Card,
  Space,
  Statistic,
  Spin,
  Button,
  Typography,
  Alert,
  Badge,
} from "antd";
import { apiService } from "../../../services";
import { useLockCommand } from "../../../hooks/useLockCommand";
import type { Lock } from "../../../types/api";
import { Wifi, WifiOff, User } from "lucide-react";
import { LockControlButton } from "../../../components/features/user";
import { CommandFeedbackToast } from "../../../components/features/locks";

const { Title, Text } = Typography;

export const UserControlPanel = () => {
  const [lock, setLock] = useState<Lock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info" | "loading";
  } | null>(null);

  // For demo purposes, we'll get the first lock. In production, this should be the user's assigned lock
  const fetchUserLock = async () => {
    try {
      const response = await apiService.locks.getAll();
      if (response.success && response.data && response.data.length > 0) {
        setLock(response.data[0]); // Get first lock for demo
      } else {
        setError("No se encontró un candado asignado");
      }
    } catch (err) {
      setError("Error al cargar el candado");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLock();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchUserLock, 10000);
    return () => clearInterval(interval);
  }, []);

  const {
    executeLock,
    executeUnlock,
    isLoading: isCommandLoading,
  } = useLockCommand(lock?.id || "", {
    onSuccess: () => {
      setToast({
        message: "✅ Comando ejecutado exitosamente",
        type: "success",
      });
      setTimeout(fetchUserLock, 1000); // Refresh lock state
    },
    onError: (error) => {
      setToast({ message: `❌ Error: ${error.message}`, type: "error" });
    },
    onStatusChange: (status) => {
      if (status === "pending") {
        setToast({
          message: "⏳ Esperando respuesta del dispositivo...",
          type: "loading",
        });
      }
    },
  });

  const handleAction = async () => {
    if (!lock) return;

    setToast({ message: "📤 Enviando comando...", type: "loading" });

    if (lock.last_state === "locked") {
      await executeUnlock({
        stationId: lock.station_id,
        controllerId: lock.controller_id,
      });
    } else {
      await executeLock({
        stationId: lock.station_id,
        controllerId: lock.controller_id,
      });
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e6f4ff 0%, #bae0ff 100%)",
        }}
      >
        <Space direction="vertical" align="center">
          <div style={{ fontSize: 60 }}>🔐</div>
          <Spin size="large" />
          <Text type="secondary" style={{ fontSize: 18 }}>
            Cargando...
          </Text>
        </Space>
      </div>
    );
  }

  if (error || !lock) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)",
        }}
      >
        <Space direction="vertical" align="center" style={{ padding: 32 }}>
          <div style={{ fontSize: 60 }}>⚠️</div>
          <Alert
            message={error || "No se pudo cargar el candado"}
            type="error"
            showIcon={false}
            style={{ marginBottom: 16 }}
          />
          <Button type="primary" danger onClick={fetchUserLock} size="large">
            Reintentar
          </Button>
        </Space>
      </div>
    );
  }

  const isOnline = lock.controller_status === "online";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e6f4ff 0%, #bae0ff 50%, #d3adf7 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Card
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: 0,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            maxWidth: 448,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            <User style={{ color: "#1677ff" }} size={24} />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                Control de Acceso
              </Title>
              <Text type="secondary">{lock.position}</Text>
            </div>
          </Space>
          <Badge
            status={isOnline ? "success" : "error"}
            text={
              <Space size="small">
                {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
                <Text
                  strong
                  style={{ color: isOnline ? "#52c41a" : "#ff4d4f" }}
                >
                  {isOnline ? "Conectado" : "Sin conexión"}
                </Text>
              </Space>
            }
          />
        </div>
      </Card>

      {/* Main Control Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", maxWidth: 448 }}
        >
          <LockControlButton
            lockStatus={lock.last_state}
            onAction={handleAction}
            isLoading={isCommandLoading}
            disabled={!isOnline}
          />

          {/* Status Info */}
          <Card
            style={{
              background: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Statistic
                  title="Batería"
                  value={lock.last_battery}
                  suffix="%"
                />
                <Statistic title="Señal" value={lock.last_rssi} suffix="dBm" />
              </div>

              <Card
                size="small"
                style={{ background: "rgba(255, 255, 255, 0.6)" }}
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Última actualización:{" "}
                  {new Date(lock.last_update).toLocaleString("es-MX", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
              </Card>
            </Space>
          </Card>
        </Space>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <CommandFeedbackToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
