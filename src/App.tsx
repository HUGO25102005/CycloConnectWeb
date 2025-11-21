/**
 * src/App.tsx
 * Versión unificada: mantiene la arquitectura remota y registra las rutas
 * /app/dashboard/stations  -> StationsDashboard (protegida)
 * /app/dashboard/actions   -> UserActions (protegida)
 */
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { App as AntdApp } from "antd";

/* Importa las features y guards existentes (traídas desde isa-branch) */
import { AppFeature, AuthFeature } from "./components/features";
import { PublicRoute, PrivateRoute, NotFoundRoute } from "./components/routes";

/* Importa las páginas nuevas que creaste */
import StationsDashboard from "./pages/app/admin/StationsDashboard";
import UserActions from "./pages/app/user/UserActions";

const App: React.FC = () => {
  return (
    <AntdApp>
      {/* Si usan un AuthProvider global, actívalo aquí */}
      <Router>
        <Routes>
          {/* Ruta raíz redirige a la autenticación */}
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* Rutas de autenticación (públicas) */}
          <Route
            path="/auth/*"
            element={
              <PublicRoute>
                <AuthFeature />
              </PublicRoute>
            }
          />

          {/* Rutas específicas del dashboard que añadimos y que deben ser privadas */}
          <Route
            path="/app/dashboard/stations"
            element={
              <PrivateRoute>
                <StationsDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/app/dashboard/actions"
            element={
              <PrivateRoute>
                <UserActions />
              </PrivateRoute>
            }
          />

          {/* Rutas principales de la aplicación (mantén la feature general) */}
          <Route
            path="/app/*"
            element={
              <PrivateRoute>
                <AppFeature />
              </PrivateRoute>
            }
          />

          {/* Ruta 404 */}
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </Router>
      {/* </AuthProvider> */}
    </AntdApp>
  );
};

export default App;
