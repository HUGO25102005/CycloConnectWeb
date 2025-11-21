import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
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

  // Si está autenticado, redirigir a la aplicación
  if (user?.uid) {
    return <Navigate to="/app" replace />;
  }

  // Si no está autenticado, mostrar el contenido público (login, etc.)
  return <>{children}</>;
};

export default PublicRoute;
