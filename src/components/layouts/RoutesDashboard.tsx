import { LayoutDashboard, ScanBarcode, UserStar, Lock } from "lucide-react";

export function getDefaultDashboardRoutes() {
  return {
    route: {
      path: "/app",
      routes: [
        {
          path: "/app/panel",
          name: "Panel Principal",
          icon: <LayoutDashboard size={18} />,
          component: "./pages/app/DashboardPage",
        },
        {
          path: "/app/admin/dashboard",
          name: "Panel Admin",
          icon: <UserStar size={18} />,
          component: "./pages/app/admin/StationsDashboard",
        },
        {
          path: "/app/admin/locks/:lockId",
          name: "Detalle de Candado",
          hideInMenu: true,
          component: "./pages/app/admin/AdminLockDetail",
        },
        // {
        //   path: "/app/user/actions",
        //   name: "Acciones",
        //   icon: <ScanBarcode size={18} />,
        //   component: "./pages/app/user/UserActions",
        // },
        // {
        //   path: "/app/user/control",
        //   name: "Control de Acceso",
        //   icon: <Lock size={18} />,
        //   component: "./pages/app/user/UserControlPanel",
        // },
      ],
    },
  };
}
