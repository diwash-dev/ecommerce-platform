import AppSidebar from "@/components/ui/navbar/SliderDash";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toggle } from "@/components/ui/navbar/Toggle";
import NotificationBell from "@/components/ui/navbar/NotificationBell"; // New notification bell component
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Dashboard component load हुँदा authentication verify गर्न
  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      navigate("/adminlogin");
    }
  }, [isAuthenticated, role, navigate]);

  // यदि authenticated छैन भने केही पनि render नगर
  if (!isAuthenticated || role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/* Admin Header with Notifications */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold hidden sm:block">
              Admin Dashboard
            </h1>
          </div>

          {/* Right side: Notification Bell and Theme Toggle */}
          <div className="flex items-center gap-2">
            <NotificationBell /> {/* Shows unread notification count */}
            <Toggle />
          </div>
        </header>

        {/* Main Content */}
        <div className="sm:mt-10 lg:m-9">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default Dashboard;
