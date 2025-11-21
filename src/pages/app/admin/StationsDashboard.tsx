import { Space, Table, Tag } from 'antd';

const { Column } = Table;

interface StationType {
  key: React.Key;
  station: string;
  status: string;
  battery: string;
  lastReading: string;
}

const stationData: StationType[] = [
  {
    key: '1',
    station: 'Estación A',
    status: 'Conectada',
    battery: '78%',
    lastReading: '2025-11-20 23:55',
  },
  {
    key: '2',
    station: 'Estación B',
    status: 'Desconectada',
    battery: '—',
    lastReading: '2025-11-19 18:12',
  },
];

export default function StationsDashboard(): JSX.Element {
  return (
    <div style={{ padding: 20 }}>
      <h1>Estado de estaciones</h1>
      <p>Aquí se mostrarán los datos y estados de las estaciones (conexión, batería, última lectura, etc.).</p>

      <Table<StationType> dataSource={stationData} style={{ marginTop: 20 }}>
        <Column title="Estación" dataIndex="station" key="station" />

        <Column
          title="Estado"
          dataIndex="status"
          key="status"
          render={(status: string) => {
            const color =
              status === 'Conectada'
                ? 'green'
                : status === 'Desconectada'
                ? 'volcano'
                : 'geekblue';

            return <Tag color={color}>{status}</Tag>;
          }}
        />

        <Column title="Batería" dataIndex="battery" key="battery" />
        <Column title="Última lectura" dataIndex="lastReading" key="lastReading" />

        <Column
          title="Acciones"
          key="actions"
          render={() => (
            <Space size="middle">
              <a>Ver detalle</a>
              <a>Actualizar</a>
            </Space>
          )}
        />
      </Table>
    </div>
  );
}
