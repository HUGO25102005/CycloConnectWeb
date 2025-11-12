import React from "react";
import { Form, Input, Button, Card, Typography, Divider, Space } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: LoginFormValues) => {
    console.log("Login values:", values);
    // Aquí iría la lógica de autenticación
  };

  const onGoogleLogin = () => {
    console.log("Google login");
    // Aquí iría la lógica de autenticación con Google
  };

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            Iniciar Sesión
          </Title>
          <Text type="secondary">Ingresa tus credenciales para continuar</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu email",
              },
              {
                type: "email",
                message: "Por favor ingresa un email válido",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="tu@email.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu contraseña",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ height: 44 }}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">o</Text>
        </Divider>

        <Button
          icon={<GoogleOutlined />}
          block
          size="large"
          onClick={onGoogleLogin}
          style={{ height: 44 }}
        >
          Continuar con Google
        </Button>
      </Space>
    </Card>
  );
};

export default LoginForm;
