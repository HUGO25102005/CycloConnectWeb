import React from 'react';

export default function StationsDashboard(): JSX.Element {
  return (
    <div style={{ padding: 20 }}>
      <h1>Estado de estaciones</h1>
      <p>Aquí se mostrarán los datos y estados de las estaciones (conexión, batería, última lectura, etc.).</p>
      <table style={{ marginTop: 12, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 6 }}>Estación</th>
            <th style={{ border: '1px solid #ccc', padding: 6 }}>Estado</th>
            <th style={{ border: '1px solid #ccc', padding: 6 }}>Batería</th>
            <th style={{ border: '1px solid #ccc', padding: 6 }}>Última lectura</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: 6 }}>Estación A</td>
            <td style={{ border: '1px solid #ccc', padding: 6 }}>Conectada</td>
            <td style={{ border: '1px solid #ccc', padding: 6 }}>78%</td>
            <td style={{ border: '1px solid #ccc', padding: 6 }}>2025-11-20 23:55</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: 6 }}>Estación B</td>
            <td style={{ border: '1px solid #ccc', padding: 6 }}>Desconectada</td>
            <td style={{ border: '1px solid #ccc', padding: 6 }}>—</td>
            <td style={{ border: '1px solid #ccc', padding: 6 }}>2025-11-19 18:12</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
