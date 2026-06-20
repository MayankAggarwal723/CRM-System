import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import EmployeeDashboard from "./pages/employees/EmployeeDashboard";
import Employee from "./pages/admin/Employee";
import Lead from "./pages/admin/Lead";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employee" element={<Employee />} />
        <Route path="/employees/dashboard" element={<EmployeeDashboard />} />
        <Route path="/admin/lead" element={<Lead />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;