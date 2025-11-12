// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { App as AntdApp } from "antd";

import { AppFeature, AuthFeature } from "./components/features";
import { PublicRoute, PrivateRoute, NotFoundRoute } from "./components/routes";

const App: React.FC = () => {
  return (
    <AntdApp>
      {/* <AuthProvider> */}
      <Router>
        <Routes>
          {/* Ruta raíz redirige a la aplicación principal */}
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* Rutas de autenticación (solo para recibir token de SAAF) */}
          <Route
            path="/auth/*"
            element={
              <PublicRoute>
                <AuthFeature />
              </PublicRoute>
            }
          />

          {/* Rutas principales de la aplicación */}
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
