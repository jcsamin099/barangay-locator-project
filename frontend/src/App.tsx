// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import ResidentsPage from "./pages/ResidentsPage";
import BarangaysPage from "./pages/BarangaysPage";
import DashboardCard from "./components/DashboardCard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminsPage from "./pages/AdminsPage"; // 🧩 NEW IMPORT

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin layout route */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        {/* default (index) route for /admin */}
        <Route index element={<DashboardCard />} />
        {/* explicit route for /admin/dashboard */}
        <Route path="dashboard" element={<DashboardCard />} />
        <Route path="residents" element={<ResidentsPage />} />
        <Route path="barangays" element={<BarangaysPage />} />
        <Route path="admins" element={<AdminsPage />} /> {/* 🧩 NEW ROUTE */}
      </Route>

      <Route path="*" element={<div className="p-6">Not Found</div>} />
    </Routes>
  );
}

export default App;
