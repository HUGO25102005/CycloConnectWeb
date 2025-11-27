import type { Lock } from "../../../types/api";
import { LockStatusBadge, BatteryIndicator, SignalIndicator } from "../locks";
import { Clock } from "lucide-react";
import { Card, Badge, Typography, Space } from "antd";

const { Text, Title } = Typography;

interface AdminLockCardProps {
  lock: Lock;
  onClick?: () => void;
}

export const AdminLockCard = ({ lock, onClick }: AdminLockCardProps) => {
  const isOnline = lock.controller_status === "online";
  const lastUpdate = new Date(lock.last_update);
  const timeSinceUpdate = Date.now() - lock.last_update;
  const isStale = timeSinceUpdate > 5 * 60 * 1000; // 5 minutes

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        opacity: isOnline ? 1 : 0.6,
        borderWidth: 2,
        borderColor: isOnline ? undefined : "#d9d9d9",
      }}
    >
      {/* Header */}
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {lock.position}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {lock.id}
            </Text>
          </div>
          <Badge
            status={isOnline ? "success" : "default"}
            text={isOnline ? "Online" : "Offline"}
          />
        </div>

        {/* Status */}
        <LockStatusBadge status={lock.last_state} size="md" />

        {/* Health Indicators */}
        <Space>
          <BatteryIndicator level={lock.last_battery} showPercentage />
          <SignalIndicator rssi={lock.last_rssi} />
        </Space>

        {/* Last Update */}
        <Space size="small">
          <Clock size={14} />
          <Text
            type={isStale ? "warning" : "secondary"}
            style={{ fontSize: 12 }}
          >
            {lastUpdate.toLocaleString("es-MX", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </Text>
        </Space>

        {/* Controller Info */}
        <div style={{ paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Controlador: {lock.controller_id}
          </Text>
        </div>
      </Space>
    </Card>
  );
};
