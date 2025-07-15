import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMobileSidebarOpen(true);
  };

  const handleCloseMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={handleCloseMobileSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet context={{ onMenuClick: handleMenuClick }} />
      </div>
    </div>
  );
};

export default Layout;