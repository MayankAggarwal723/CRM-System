import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Employee from "./pages/admin/Employee";
import Lead from "./pages/admin/Lead";
import EmployeeDashboard from "./pages/employees/EmployeeDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employee" element={<Employee />} />
        <Route path="/admin/lead" element={<Lead />} />

        <Route path="/employees/dashboard" element={<EmployeeDashboard />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;