// app/dashboard/layout.jsx
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
import "@/styles/layout-dashboard.css"; // اضافه کردن فایل استایل جدید

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
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

  if (!mounted) {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="dashboard-layout">
      <Navbar 
        onMenuClick={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="layout-container">
        <aside className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
          <Sidebar onClose={closeSidebar} />
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}