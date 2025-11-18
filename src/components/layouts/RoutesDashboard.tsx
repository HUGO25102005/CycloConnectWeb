import { LayoutDashboard } from "lucide-react";

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
      ],
    },
  };
}
