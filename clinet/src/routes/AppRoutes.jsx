import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Employee from "./pages/employee/Employee";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import Leads from "./pages/admin/Leads";
import Calls from "./pages/admin/Calls";
import Logs from "./pages/admin/Logs";
import Tasks from "./pages/admin/Tasks";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/Employee"
          element={<Employee />}
        />

        <Route
          path="/employee/dashboard"
          element={<EmployeeDashboard />}
        />

        <Route path="/admin/leads" element={<Leads />} />
        <Route path="/admin/calls" element={<Calls />} />
        <Route path="/admin/logs" element={<Logs />} />
        <Route path="/admin/tasks" element={<Tasks />} />
        <Route path="/admin/settings" element={<Settings />} />
        
        <Route
          path="*"
          element={<h1>ROUTE NOT FOUND</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;