import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import ResidentSidebar from "../components/ResidentSidebar";

const ResidentMainPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🟩 Sidebar (handles its own hamburger toggle) */}
      <div className="fixed left-0 top-0 h-full z-30">
        <ResidentSidebar />
      </div>

      {/* 🟧 Main Content Area */}
      <div className="flex flex-col flex-1 lg:ml-64">
        {/* Header */}
        <Header />

        {/* Outlet Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResidentMainPage;
