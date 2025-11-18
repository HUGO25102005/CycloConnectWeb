import React, { useState } from "react";
import { ChevronsRight, Space } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getDefaultDashboardRoutes } from "./RoutesDashboard";
import { ProLayout, type ProSettings } from "@ant-design/pro-components";
import { Tooltip, Typography } from "antd";
import logo from "../../assets/logo.png";
import AvatarButtons from "./AvatarButtons";

// Buscar icono por path (FUERA del componente)
const findRouteIcon = (path: string, routes: any[]): React.ReactNode => {
  for (const route of routes) {
    if (route.path === path) {
      return route.icon;
    }
    if (route.routes) {
      const icon = findRouteIcon(path, route.routes);
      if (icon) return icon;
    }
  }
  return null;
};

const DashboardLayout: React.FC = () => {
  //   const dispatch = useDispatch();
  //   const mode = useSelector((state: RootState) => state.theme.mode);
  const { Text } = Typography;

  // Settings con sincronización del theme
  const [settings] = useState<Partial<ProSettings>>({
    fixSiderbar: true,
    layout: "mix",
    splitMenus: false,
    navTheme: "light",
    contentWidth: "Fluid",
    fixedHeader: true,
    siderMenuType: "sub",
  });

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const hideBreadcrumbRoutes = ["/", "/welcome", "/dashboard"];

  // Obtener rutas del menú
  const route = getDefaultDashboardRoutes();
  const allRoutes = route.route.routes || [];

  return (
    <ProLayout
      //   {...defaultPropsDashboardLayout}
      {...settings}
      {...route}
      location={{ pathname }}
      siderWidth={256}
      selectedKeys={[pathname]}
      onMenuHeaderClick={() => navigate("/")}
      // Breadcrumb con iconos
      breadcrumbProps={{
        separator: (
          <ChevronsRight
            className="icon-align-middle"
            size={13}
            style={{ marginTop: 2.5 }}
          />
        ),
        itemRender: (route: any, _params, routes: any[], _paths) => {
          const isFirst = routes.indexOf(route) === 0;
          const isLast = routes.indexOf(route) === routes.length - 1;
          const routePath = route.linkPath || route.path; // Usar linkPath en lugar de path (ProLayout usa linkPath internamente)
          const icon = findRouteIcon(routePath, allRoutes);
          // Estilos base
          let style: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: 2,
            marginLeft: isFirst ? 10 : 0,
            marginBottom: 10,
            transition: "color 0.3s ease-in-out",
          };
          if (isLast) {
            return (
              <span style={style}>
                {icon && <span style={{ display: "flex" }}>{icon}</span>}
                <span>{route.breadcrumbName}</span>
              </span>
            );
          }

          style.cursor = "pointer";
          //   style.color = token.colorTextLabel;

          return (
            <span
              onClick={() => navigate(routePath)}
              style={style}
              //   onMouseEnter={(e) => {
              //     // e.currentTarget.style.color = token.colorPrimary;
              //   }}
              //   onMouseLeave={(e) => {
              //     e.currentTarget.style.color = token.colorTextLabel;
              //   }}
            >
              {icon && <span style={{ display: "flex" }}>{icon}</span>}
              <span>{route.breadcrumbName}</span>
            </span>
          );
        },
      }}
      breadcrumbRender={(routers = []) => {
        if (hideBreadcrumbRoutes.includes(pathname)) {
          return [];
        }
        return routers;
      }}
      // Logo y título
      logo={logo}
      title="IoT Dashboard"
      // Personalizado del header
      headerTitleRender={(logo, title) => (
        <Space onClick={() => navigate("/")}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0px",
              cursor: "pointer",
              padding: "8px 12px",
            }}
          >
            {logo}{" "}
            <Text strong style={{ margin: 0 }}>
              {title}
            </Text>
          </div>
        </Space>
      )}
      // Menu items con navegación
      menuItemRender={(item, _dom, props) => {
        const isActive = pathname === item.path;
        const isCollapsed = props?.collapsed;

        // Estilos base
        let style: React.CSSProperties = {
          cursor: "pointer",
          color: isActive ? "primary" : "",
          display: "flex",
          alignItems: "center",
          transition: "all 0.2s",
        };

        if (isCollapsed) {
          style.justifyContent = "center";
          style.padding = "12px 0";

          // Colapsado: solo icono, texto en tooltip
          return (
            <Tooltip title={item.name} placement="right" key={item.path}>
              <div onClick={() => navigate(item.path!)} style={style}>
                {item.icon}
              </div>
            </Tooltip>
          );
        }

        style.gap = 10;
        if (["submenu", "group"].includes(item.type || ""))
          style.paddingLeft = 0; // Ajustes según tipo

        return (
          <div onClick={() => navigate(item.path!)} style={style}>
            {item.icon && <span style={{ display: "flex" }}>{item.icon}</span>}
            <span>{item.name}</span>
          </div>
        );
      }}
      // Botones del header (búsqueda, notificaciones, etc)
      actionsRender={() => [
        // <LocalButton iconSize={20} />,
        // <ThemeButtonSwitch
        //   iconSize={20}
        //   mode={mode}
        //   onChange={() => dispatch(themeToggleMode())}
        // />,
      ]}
      // Avatar y menú de usuario
      avatarProps={{ render: () => <AvatarButtons /> }}
      // Footer del menú
      menuFooterRender={(props) => {
        if (props?.collapsed) return undefined;
        return (
          <div style={{ textAlign: "center", paddingBlockStart: 12 }}>
            <div>© 2025 by Tedyc</div>
          </div>
        );
      }}
      // Configuraciones de tokens de color
      token={{
        header: {
          // colorBgHeader: "",
          // colorHeaderTitle: "",
          // colorTextMenu: "",
          // colorTextMenuSecondary: "",
        },
        pageContainer: {
          // colorBgPageContainer: "",
          // colorBgPageContainerFixed: "",
          paddingBlockPageContainerContent: 10,
          paddingInlinePageContainerContent: 25,
        },
        sider: {
          // colorMenuBackground: "",
          // colorTextMenu: "",
          // colorTextMenuSelected: "",
        },
      }}
      // Configuración del menú
      menu={{
        collapsedShowGroupTitle: true,
        defaultOpenAll: false,
        ignoreFlatMenu: false,
        type: "sub",
        autoClose: false,
      }}
    >
      {/* Contenido de las páginas */}
      <Outlet />
    </ProLayout>
  );
};

export default DashboardLayout;
