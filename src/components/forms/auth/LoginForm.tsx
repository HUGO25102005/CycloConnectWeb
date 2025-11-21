import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Space,
  message,
} from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { useAuth } from "../../../hooks/useAuth";
import logo from "../../../assets/logo.png";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const { login, status, error, clearAuthError } = useAuth();

  // Mostrar errores usando message de Ant Design
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Limpiar errores cuando el usuario cambie los campos
  const handleFieldsChange = () => {
    if (error) {
      clearAuthError();
    }
  };

  const onFinish = (values: LoginFormValues) => {
    login(values.email.trim(), values.password);
  };

  const onGoogleLogin = () => {
    message.info("Login con Google - Próximamente");
    // Aquí iría la lógica de autenticación con Google en el futuro
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
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: "150px",
              height: "auto",
              marginBottom: 24,
              borderRadius: 75,
            }}
          />
          <Title level={2} style={{ marginBottom: 8 }}>
            Iniciar Sesión
          </Title>
          <Text type="secondary">Ingresa tus credenciales para continuar</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          onFieldsChange={handleFieldsChange}
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
              loading={status === "loading"}
              disabled={status === "loading"}
              style={{ height: 44 }}
            >
              {status === "loading" ? "Iniciando sesión..." : "Iniciar Sesión"}
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
