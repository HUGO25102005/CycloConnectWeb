import { PageContainer } from "@ant-design/pro-components";
import { Typography } from "antd";

const { Title } = Typography;

const DashboardPage = () => {
  return (
    <PageContainer title="Panel Principal">
      <div style={{ padding: "24px" }}>
        <Title level={2}>Bienvenido al Panel Principal</Title>
        <p>Aquí podrás gestionar y monitorear tu sistema IoT.</p>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
