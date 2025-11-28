import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  Space,
  Statistic,
  Spin,
  Button,
  Typography,
  Alert,
  Badge,
  message,
} from "antd";
import { apiService } from "../../../services";
import { useLockCommand } from "../../../hooks/useLockCommand";
import type { Lock } from "../../../types/api";
import { Wifi, WifiOff, User, Lock as LockIcon } from "lucide-react";
import { LockControlButton } from "../../../components/features/user";

const { Title, Text } = Typography;

export const UserControlPanel = () => {
  const [lock, setLock] = useState<Lock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const loadingMessageKey = useRef<(() => void) | null>(null);

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

  const handleSuccess = useCallback(() => {
    // Destroy loading message if exists
    if (loadingMessageKey.current) {
      loadingMessageKey.current();
      loadingMessageKey.current = null;
    }
    messageApi.success("Comando ejecutado exitosamente");
    setTimeout(fetchUserLock, 1000); // Refresh lock state
  }, [messageApi]);

  const handleError = useCallback(
    (error: Error) => {
      // Destroy loading message if exists
      if (loadingMessageKey.current) {
        loadingMessageKey.current();
        loadingMessageKey.current = null;
      }
      messageApi.error(`Error: ${error.message}`);
    },
    [messageApi]
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      if (status === "pending") {
        // Destroy previous loading message if exists
        if (loadingMessageKey.current) {
          loadingMessageKey.current();
        }
        loadingMessageKey.current = messageApi.loading(
          "Esperando respuesta del dispositivo...",
          0
        );
      }
    },
    [messageApi]
  );

  const {
    executeLock,
    executeUnlock,
    isLoading: isCommandLoading,
  } = useLockCommand(lock?.id || "", {
    onSuccess: handleSuccess,
    onError: handleError,
    onStatusChange: handleStatusChange,
  });

  const handleAction = async () => {
    if (!lock) return;

    // Destroy previous loading message if exists
    if (loadingMessageKey.current) {
      loadingMessageKey.current();
    }
    loadingMessageKey.current = messageApi.loading("Enviando comando...", 0);

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
          <LockIcon size={60} />
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
                  {new Date(
                    typeof lock.updated_at === "number"
                      ? lock.updated_at
                      : lock.updated_at._seconds * 1000
                  ).toLocaleString("es-MX", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
              </Card>
            </Space>
          </Card>
        </Space>
      </div>

      {contextHolder}
    </div>
  );
};
