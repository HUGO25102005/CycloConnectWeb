import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "loading";

interface CommandFeedbackToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
}

export const CommandFeedbackToast = ({
  message,
  type,
  duration = 3000,
  onClose,
}: CommandFeedbackToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type !== "loading" && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for fade-out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);

  const config = {
    success: {
      icon: <CheckCircle size={20} />,
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-800",
      iconColor: "text-green-600",
    },
    error: {
      icon: <XCircle size={20} />,
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      textColor: "text-red-800",
      iconColor: "text-red-600",
    },
    info: {
      icon: <AlertCircle size={20} />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
    },
    loading: {
      icon: <Loader2 size={20} className="animate-spin" />,
      bgColor: "bg-gray-50",
      borderColor: "border-gray-500",
      textColor: "text-gray-800",
      iconColor: "text-gray-600",
    },
  };

  const currentConfig = config[type];

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg ${currentConfig.bgColor} ${currentConfig.borderColor}`}
      >
        <span className={currentConfig.iconColor}>{currentConfig.icon}</span>
        <p className={`font-medium ${currentConfig.textColor}`}>{message}</p>
        {type !== "loading" && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className={`ml-2 ${currentConfig.textColor} hover:opacity-70`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
