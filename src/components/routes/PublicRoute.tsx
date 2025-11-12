import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
// import { useAuth } from "../../features/auth/hooks";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, status } = useAuth();

  const isLoading = status === "loading" || status === "initializing";

  if (isLoading && user === null) {
    return <Navigate to="/auth" replace />;
  }

  // Si está cargando o validando, mostrar loading
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
              <Spin size="large" spinning={isLoading} />
          </div>
      );
  }

  // Solo redirigir si está definitivamente autenticado
  if (user?.uid) {
      return <Navigate to="/app" replace />;
  }
  return <>{children}</>;
};

export default PublicRoute;
