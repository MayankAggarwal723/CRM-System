import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Employee from "./pages/admin/Employee";
import Lead from "./pages/admin/Lead";
import Logs from "./pages/admin/Logs";
import Settings from "./pages/admin/Settings";
import Tasks from "./pages/admin/Tasks";
import CreateEmployee from "./pages/admin/CreateEmployee";

import EmployeeDashboard from "./pages/employees/EmployeeDashboard";
import EmployeeTasks from "./pages/employees/EmployeeTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employee"  element={<Employee />} />
        <Route path="/admin/leads"     element={<Lead />} />
        <Route path="/admin/logs"      element={<Logs />} />
        <Route path="/admin/settings"  element={<Settings />} />
        <Route path="/admin/tasks"     element={<Tasks />} />
        <Route path="/admin/CreateEmployee" element={<CreateEmployee />} />

        <Route path="/employees/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employees/EmployeeTasks" element={<EmployeeTasks />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;