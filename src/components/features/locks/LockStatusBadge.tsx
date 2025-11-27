import { Badge } from "antd";
import { Lock, LockOpen, HelpCircle } from "lucide-react";

type LockStatus = "locked" | "unlocked" | "unknown";

interface LockStatusBadgeProps {
  status: LockStatus | undefined | null;
  size?: "sm" | "md" | "lg";
}

export const LockStatusBadge = ({
  status,
  size = "md",
}: LockStatusBadgeProps) => {
  const getStatusConfig = (status: LockStatus | undefined | null) => {
    // Handle undefined or null status
    if (!status) {
      return {
        icon: (
          <HelpCircle size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
        ),
        text: "Desconocido",
        color: "default" as const,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
      };
    }

    switch (status) {
      case "locked":
        return {
          icon: <Lock size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />,
          text: "Bloqueado",
          color: "success" as const,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case "unlocked":
        return {
          icon: (
            <LockOpen size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
          ),
          text: "Abierto",
          color: "warning" as const,
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
        };
      case "unknown":
      default:
        return {
          icon: (
            <HelpCircle size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
          ),
          text: "Desconocido",
          color: "default" as const,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };
    }
  };

  const config = getStatusConfig(status);

  const sizeClass =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <Badge
      status={config.color}
      text={
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${config.bgColor} ${sizeClass} font-medium ${config.textColor}`}
        >
          {config.icon}
          <span>{config.text}</span>
        </span>
      }
    />
  );
};
