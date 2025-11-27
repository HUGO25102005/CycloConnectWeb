import { Wifi, WifiOff } from "lucide-react";
import { Tag } from "antd";

interface SignalIndicatorProps {
  rssi: number; // Signal strength in dBm
  showValue?: boolean;
  size?: number;
}

export const SignalIndicator = ({
  rssi,
  showValue = false,
  size = 18,
}: SignalIndicatorProps) => {
  const getSignalConfig = (rssi: number) => {
    // RSSI ranges (dBm):
    // -30 to -50: Excellent
    // -50 to -60: Good
    // -60 to -70: Fair
    // -70+: Poor/No signal

    if (rssi >= -50) {
      return {
        icon: <Wifi size={size} />,
        color: "success" as const,
        label: "Excelente",
      };
    }
    if (rssi >= -60) {
      return {
        icon: <Wifi size={size} />,
        color: "processing" as const,
        label: "Buena",
      };
    }
    if (rssi >= -70) {
      return {
        icon: <Wifi size={size} />,
        color: "warning" as const,
        label: "Regular",
      };
    }
    return {
      icon: <WifiOff size={size} />,
      color: "error" as const,
      label: "Débil",
    };
  };

  const config = getSignalConfig(rssi);

  return (
    <Tag
      color={config.color}
      icon={config.icon}
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      {showValue && `${rssi} dBm`}
    </Tag>
  );
};
