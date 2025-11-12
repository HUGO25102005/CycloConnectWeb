import React from "react";
// import { useAuth } from "../../features/auth/hooks";

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    
    // const { isAuthenticated, loading, isValidating } = useAuth();

    // Si está cargando o validando, mostrar loading
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
    //             <Spin size="large" spinning={loading || isValidating} />
    //         </div>
    //     );
    // }

    // Solo redirigir si está definitivamente autenticado
    // if (isAuthenticated === true) {
    //     return <Navigate to="/app" replace />;
    // }

    // Si no está autenticado o la validación falló, mostrar contenido público
    return <>{children}</>;
};

export default PublicRoute;
