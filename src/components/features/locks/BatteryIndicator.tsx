import {
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
} from "lucide-react";
import { Tag } from "antd";

interface BatteryIndicatorProps {
  level: number; // 0-100
  showPercentage?: boolean;
  size?: number;
}

export const BatteryIndicator = ({
  level,
  showPercentage = true,
  size = 18,
}: BatteryIndicatorProps) => {
  const getBatteryConfig = (level: number) => {
    if (level < 20) {
      return {
        icon: <BatteryWarning size={size} />,
        color: "error" as const,
      };
    }
    if (level < 50) {
      return {
        icon: <BatteryLow size={size} />,
        color: "warning" as const,
      };
    }
    if (level < 80) {
      return {
        icon: <BatteryMedium size={size} />,
        color: "processing" as const,
      };
    }
    return {
      icon: <Battery size={size} />,
      color: "success" as const,
    };
  };

  const config = getBatteryConfig(level);

  return (
    <Tag
      color={config.color}
      icon={config.icon}
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      {showPercentage && `${level}%`}
    </Tag>
  );
};
