import React from "react";
import { Avatar, Dropdown, type MenuProps } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AvatarButtons: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div style={{ padding: "4px 0" }}>
          <div style={{ fontWeight: 500 }}>
            {user?.displayName || user?.email || "Usuario"}
          </div>
          {user?.email && (
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {user.email}
            </div>
          )}
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Cerrar Sesión",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Avatar
        style={{ cursor: "pointer" }}
        src={user?.photoURL}
        icon={!user?.photoURL && <UserOutlined />}
        alt={user?.displayName || user?.email || "Usuario"}
      />
    </Dropdown>
  );
};

export default AvatarButtons;
