import React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
// import { useAuth } from "../../features/auth/hooks";

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    
    // const { isAuthenticated, loading, isValidating } = useAuth();

    // Mostrar loading mientras se valida la sesión
    // if (loading || isValidating) {
    //     return (
    //         <div
    //             style={{
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //                 height: "100vh",
    //             }}
    //         >
    //             <Spin size="large" />
    //         </div>
    //     );
    // }

    // Solo redirigir si está definitivamente NO autenticado
    // if (isAuthenticated === false) {
    //     return <Navigate to="/auth" replace />;
    // }

    // Si está autenticado, mostrar el contenido
    return <>{children}</>;
};

export default PrivateRoute;
