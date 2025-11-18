import React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../../hooks/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isInitialized, loading } = useAuth();

  // Mostrar loading solo durante la inicialización
  if (!isInitialized || loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Si no está autenticado después de la inicialización, redirigir al login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
};

export default PrivateRoute;
