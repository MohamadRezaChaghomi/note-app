"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/ui/Navbar";

import { Loader2 } from "lucide-react";

import "@/styles/dashboard.css";
import "@/styles/sidebar.css";
import "@/styles/navbar.css";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (status === "loading" || !session) {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar - در موبایل با منو همبرگر کنترل میشه */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar onClose={closeSidebar} />
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Navbar */}
        <div className="layout-navbar">
          <Navbar 
            onMenuClick={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
        </div>
        
        {/* Content */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>

      {/* Mobile Overlay - وقتی سایدبار بازه */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}