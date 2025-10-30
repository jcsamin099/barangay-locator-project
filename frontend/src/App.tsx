import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import ResidentsPage from "./pages/ResidentsPage";
import BarangaysPage from "./pages/BarangaysPage";
import DashboardCard from "./components/DashboardCard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminsPage from "./pages/AdminsPage";
import AdminAccountPage from "./pages/AdminAccountPage";
import ResidentMainPage from "./pages/ResidentMainPage";
import ResidentNavigatePage from "./pages/ResidentNavigatePage"; // ✅ Added Navigate page

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
        <Route index element={<DashboardCard />} />
        <Route path="dashboard" element={<DashboardCard />} />
        <Route path="residents" element={<ResidentsPage />} />
        <Route path="barangays" element={<BarangaysPage />} />
        <Route path="admins" element={<AdminsPage />} />
        <Route path="account" element={<AdminAccountPage />} />
      </Route>

      {/* 🧭 Protected Resident Routes */}
      <Route
        path="/resident-main"
        element={
          <ProtectedRoute requiredRole="resident">
            <ResidentMainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident-navigate"
        element={
          <ProtectedRoute requiredRole="resident">
            <ResidentNavigatePage />
          </ProtectedRoute>
        }
      />

      {/* 🚫 Fallback for undefined paths */}
      <Route path="*" element={<div className="p-6">Not Found</div>} />
    </Routes>
  );
}

export default App;
