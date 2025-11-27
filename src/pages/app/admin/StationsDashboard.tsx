import { Space, Typography } from "antd";
import { AdminLocksGrid } from "../../../components/features/admin";

const { Title, Paragraph } = Typography;

export default function StationsDashboard() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={2}>Panel de Administración</Title>
        <Paragraph type="secondary">
          Monitoreo y control de candados inteligentes
        </Paragraph>
      </div>
      <AdminLocksGrid />
    </Space>
  );
}
