import { BookOpenText, LayoutDashboard, ShoppingBag } from "lucide-react";

export function getDefaultDashboardRoutes() {
    return {
        route: {
            path: "/app",
            routes: [
                {
                    path: "/app/panel",
                    name: "Panel",
                    icon: <LayoutDashboard size={18} />,
                    component: "./pages/dashboard/DashboardPage",
                },
                {
                    path: "/app/catalogues",
                    name: "Catálogos",
                    icon: <BookOpenText size={18} />,
                    component: "./pages/dashboard/catalogues/CatalogosPage",
                    routes: [
                        {
                            path: "/app/catalogues/concepts",
                            name: "Conceptos",
                            icon: <ShoppingBag size={18} />,
                            component: "./pages/dashboard/concepts/ConceptsPage",
                        },
                    ],
                },

            ],
        },
    };
}
