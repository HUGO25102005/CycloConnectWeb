import React from 'react';

export default function UserActions(): JSX.Element {
  return (
    <div style={{ padding: 20 }}>
      <h1>Acciones de usuario</h1>
      <p>Controles y acciones que el usuario puede ejecutar sobre las estaciones.</p>

      <div style={{ marginTop: 12 }}>
        <button style={{ padding: '8px 12px' }}>Reiniciar estación</button>
        <button style={{ padding: '8px 12px', marginLeft: 8 }}>Asignar tarea</button>
        <button style={{ padding: '8px 12px', marginLeft: 8 }}>Bloquear estación</button>
      </div>

      <section style={{ marginTop: 18 }}>
        <h3>Acciones recientes</h3>
        <ul>
          <li>Reinicio enviado a Estación A — 2025-11-21 07:15</li>
          <li>Tarea asignada a Estación B — 2025-11-20 19:02</li>
        </ul>
      </section>
    </div>
  );
}
