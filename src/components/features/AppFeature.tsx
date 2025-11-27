import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/Dashboadlayout";
import WelcomePage from "../../pages/app/WelcomePage";
import DashboardPage from "../../pages/app/DashboardPage";
import StationsDashboard from "../../pages/app/admin/StationsDashboard";
import UserActions from "../../pages/app/user/UserActions";

const AppFeature = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<WelcomePage />} />

        {/* Panel principal */}
        <Route path="/panel" element={<DashboardPage />} />
        {/* Panel principal */}
        <Route path="/admin/dashboard" element={<StationsDashboard />} />
        {/* Panel principal */}
        <Route path="/user/actions" element={<UserActions />} />
        <Route path="/user/control" element={<UserActions />} />

        {/* Gestión de empresa */}
        {/* <Route path="/company" element={<InfoPage />} />
                <Route path="/company/create" element={<NewCompany />} /> */}

        {/* Gestión de sucursales */}
        {/* <Route path="/company/branches" element={<BranchesPage />} /> */}

        {/* Gestión organizacional */}
        {/* <Route
                    path="/company/branches/departments"
                    element={<DepartmentsPage />}
                />
                <Route
                    path="/company/branches/departments/roles"
                    element={<RolesPage />}
                /> */}

        {/* Gestión de miembros */}
        {/* <Route
                    path="/company/members/employees"
                    element={<EmployeesPage />}
                /> */}

        {/* Gestión de colaboradores */}
        {/* <Route
                    path="/company/collaborators/clients"
                    element={<ClientsPage />}
                />
                <Route
                    path="/company/collaborators/providers"
                    element={<ProvidersPage />}
                />
                <Route
                    path="/company/collaborators/providers/create"
                    element={<ProvidersActionsPage />}
                />
                <Route
                    path="/company/collaborators/providers/:id"
                    element={<ProvidersActionsPage />}
                /> */}
      </Route>
      {/* Ruta raíz de la aplicación */}
    </Routes>
  );
};

export default AppFeature;
