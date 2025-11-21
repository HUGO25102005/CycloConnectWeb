import React from 'react';
import { Table, Button, Space, Tag } from 'antd';

const { Column } = Table;

interface ActionType {
  key: React.Key;
  action: string;
  station: string;
  timestamp: string;
}

const actionsData: ActionType[] = [
  {
    key: '1',
    action: 'Reinicio enviado',
    station: 'Estación A',
    timestamp: '2025-11-21 07:15',
  },
  {
    key: '2',
    action: 'Tarea asignada',
    station: 'Estación B',
    timestamp: '2025-11-20 19:02',
  },
];

export default function UserActions(): JSX.Element {
  return (
    <div style={{ padding: 20 }}>
      <h1>Acciones de usuario</h1>
      <p>Controles y acciones que el usuario puede ejecutar sobre las estaciones.</p>

      <section style={{ marginTop: 24 }}>
        <h3>Acciones recientes</h3>

        <Table<ActionType> dataSource={actionsData} pagination={false} style={{ marginTop: 12 }}>
          <Column title="Acción" dataIndex="action" key="action" />

          <Column
            title="Estación"
            dataIndex="station"
            key="station"
            render={(station: string) => <Tag color="blue">{station}</Tag>}
          />

          <Column title="Fecha y hora" dataIndex="timestamp" key="timestamp" />

          <Column
            title="Acciones"
            key="acciones"
            render={() => (
              <Space>
                <Button type="primary">Reiniciar estación</Button>
                <Button>Asignar tarea</Button>
                <Button danger>Bloquear estación</Button>
              </Space>
            )}
          />
        </Table>
      </section>
    </div>
  );
}
