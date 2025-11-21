import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import StationsDashboard from './pages/StationsDashboard';
import UserActions from './pages/UserActions';

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div style={{ padding: 12 }}>
        <header style={{ marginBottom: 12 }}>
          <nav>
            <Link to="/" style={{ marginRight: 10 }}>Home</Link>
            <Link to="/dashboard/stations" style={{ marginRight: 10 }}>Estaciones</Link>
            <Link to="/dashboard/actions">Acciones</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<div><h2>Bienvenido</h2><p>Página principal del proyecto</p></div>} />
            <Route path="/dashboard/stations" element={<StationsDashboard />} />
            <Route path="/dashboard/actions" element={<UserActions />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
