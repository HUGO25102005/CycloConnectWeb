import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
// import { useAuth } from "../../features/auth/hooks";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, status, loading: loadingAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      loadingAuth === true ||
      status === "loading" ||
      status === "initializing"
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loadingAuth, status]);

  
  if (loading && user === null) {
    return <Navigate to="/auth" replace />;
  }

  // Si está cargando o validando, mostrar loading
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" spinning={loading} />
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
