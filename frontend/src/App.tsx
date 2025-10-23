// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import ResidentsPage from "./pages/ResidentsPage";
import BarangaysPage from "./pages/BarangaysPage";
import DashboardCard from "./components/DashboardCard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminsPage from "./pages/AdminsPage";
import AdminAccountPage from "./pages/AdminAccountPage"; // 🧩 NEW IMPORT

function App() {
  return (
    <Routes>
      {/* 🔹 Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🔒 Protected Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        {/* 🏠 Default (index) route for /admin */}
        <Route index element={<DashboardCard />} />
        <Route path="dashboard" element={<DashboardCard />} />
        <Route path="residents" element={<ResidentsPage />} />
        <Route path="barangays" element={<BarangaysPage />} />
        <Route path="admins" element={<AdminsPage />} />
        <Route path="account" element={<AdminAccountPage />} /> {/* 🧩 NEW ROUTE */}
      </Route>

      {/* 🚫 Fallback for undefined paths */}
      <Route path="*" element={<div className="p-6">Not Found</div>} />
    </Routes>
  );
}

export default App;
