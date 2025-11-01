// src/pages/ResidentMainPage.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import ResidentSidebar from "../components/ResidentSidebar";

const ResidentMainPage = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      {/* Sidebar (fixed on mobile, static on desktop) */}
      <div className="lg:static fixed inset-0 lg:inset-auto z-50 lg:z-auto">
        <ResidentSidebar />
      </div>

      {/* Main content */}
      <main
        className="flex-1 h-full transition-all duration-300 
                   lg:ml-64 p-4 md:p-6 overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ResidentMainPage;
