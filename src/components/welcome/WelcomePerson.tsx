import { ProCard } from "@ant-design/pro-components";
import { Col, Row, Space, Typography, theme, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

const WelcomePerson = () => {
  const { token } = theme.useToken();
  const { Title, Text } = Typography;
  const { user } = useAuth();

  // Obtener el nombre del usuario o usar el email como fallback
  const userName = user?.displayName || user?.email?.split("@")[0] || "Usuario";
  const userEmail = user?.email || "";
  const userPhoto = user?.photoURL || null;

  // Configuración de la aplicación
  const appName = "Plataforma IoT";
  const appDescription = "Sistema de gestión y monitoreo de dispositivos IoT";

  return (
    <Row justify="center">
      <Col lg={24}>
        <ProCard
          className="border-radius-10 box-shadow-1"
          style={{
            background: `linear-gradient(135deg, ${token.colorFillTertiary} 0%, ${token.colorBgBase} 100%)`,
          }}
          bordered
        >
          <Row justify="space-between" align="middle" gutter={[24, 16]}>
            <Col flex="auto">
              <Space direction="vertical" size="small">
                <Title className="font-bold" style={{ margin: 0 }} level={3}>
                  ¡Hola, {userName}!
                </Title>
                <Text className="font-regular" style={{ margin: 0 }}>
                  Bienvenido a {appName}
                </Text>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  {appDescription}
                </Text>
                {userEmail && (
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {userEmail}
                  </Text>
                )}
              </Space>
            </Col>
            <Col>
              <Avatar
                size={65}
                src={userPhoto}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: token.colorPrimary,
                }}
              />
            </Col>
          </Row>
        </ProCard>
      </Col>
    </Row>
  );
};

export default WelcomePerson;
