import React from "react";

import { Layout, Space, Typography } from "antd";

const { Title } = Typography;
const { Content, Footer } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Content
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          overflow: "auto",
        }}
      >
        {/* <div
          style={{
            width: "100%",
            maxWidth: "1200px",
          }}
        > */}
          {children}
        {/* </div> */}
      </Content>
      <Footer
        style={{
          padding: "16px 24px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <Space
          direction="vertical"
          size={0}
          align="center"
          style={{ width: "100%" }}
        >
          <Title className="font-regular" level={5} style={{ margin: 0 }}>
            {"Copyright © 2025 - Todos los derechos reservados"}
          </Title>
        </Space>
      </Footer>
    </Layout>
  );
};

export default AuthLayout;
