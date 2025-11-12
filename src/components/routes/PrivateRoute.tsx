import React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../../hooks/useAuth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, status } = useAuth();
  const isLoading = status === "loading" || status === "initializing";

  // Mostrar loading mientras se valida la sesión inicial o durante operaciones de autenticación
  if (isLoading && user === null) {
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

  // Si no está autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
};

export default PrivateRoute;
