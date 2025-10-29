// src/pages/AdminDashboard.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar is fully controlled inside Sidebar.tsx */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 w-full p-6 sm:p-8 lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
