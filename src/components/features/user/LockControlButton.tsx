import { Lock, LockOpen, Loader2 } from "lucide-react";
import { useState } from "react";

interface LockControlButtonProps {
  lockStatus: "locked" | "unlocked" | "unknown";
  onAction: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const LockControlButton = ({
  lockStatus,
  onAction,
  isLoading,
  disabled = false,
}: LockControlButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handlePointerDown = () => {
    if (disabled || isLoading) return;

    setIsPressed(true);
    const timer = setTimeout(() => {
      onAction();
      setIsPressed(false);
    }, 800); // Long press duration: 800ms

    setPressTimer(timer);
  };

  const handlePointerUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    setIsPressed(false);
  };

  const getButtonConfig = () => {
    if (lockStatus === "locked") {
      return {
        icon: <Lock size={80} />,
        text: "Mantener para Abrir",
        bg: "bg-gradient-to-br from-green-500 to-green-600",
        hoverBg: "hover:from-green-600 hover:to-green-700",
        shadow: "shadow-green-500/50",
        ring: "ring-green-400",
      };
    }
    if (lockStatus === "unlocked") {
      return {
        icon: <LockOpen size={80} />,
        text: "Tocar para Cerrar",
        bg: "bg-gradient-to-br from-orange-500 to-orange-600",
        hoverBg: "hover:from-orange-600 hover:to-orange-700",
        shadow: "shadow-orange-500/50",
        ring: "ring-orange-400",
      };
    }
    return {
      icon: <Lock size={80} />,
      text: "Estado Desconocido",
      bg: "bg-gradient-to-br from-gray-400 to-gray-500",
      hoverBg: "hover:from-gray-500 hover:to-gray-600",
      shadow: "shadow-gray-500/50",
      ring: "ring-gray-400",
    };
  };

  const config = getButtonConfig();

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        disabled={disabled || isLoading}
        className={`
          relative w-72 h-72 rounded-full
          ${config.bg} ${config.hoverBg}
          text-white shadow-2xl ${config.shadow}
          transition-all duration-300 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95
          ${isPressed ? `scale-105 ${config.ring} ring-8` : "scale-100"}
          ${isLoading ? "animate-pulse" : ""}
        `}
      >
        <div className="flex flex-col items-center justify-center h-full gap-4">
          {isLoading ? (
            <Loader2 size={80} className="animate-spin" />
          ) : (
            config.icon
          )}
        </div>

        {/* Progress ring for long press */}
        {isPressed && !isLoading && (
          <div className="absolute inset-0 rounded-full">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeDasharray="1000"
                strokeDashoffset="0"
                className="animate-[dash_0.8s_linear_forwards]"
                style={{
                  animation: "dash 0.8s linear forwards",
                }}
              />
            </svg>
          </div>
        )}
      </button>

      {/* Instruction Text */}
      <p className="text-xl font-semibold text-gray-700 text-center px-4">
        {isLoading ? "Enviando comando..." : config.text}
      </p>

      {/* Add keyframes for progress animation */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 1000;
          }
        }
      `}</style>
    </div>
  );
};
