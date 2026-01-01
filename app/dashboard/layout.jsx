"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import { Loader2, Bell, Search, LogOut, Settings, Menu, X } from "lucide-react";
import "@/styles/dashboard.css";
import "@/styles/sidebar.css";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex-1">
              <h1 className="dashboard-title">Welcome back, {session.user?.name?.split(" ")[0] || "User"}! 👋</h1>
            </div>
          </div>

          <div className="dashboard-header-actions">
            {/* Search */}
            <div className="dashboard-search">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes, folders..."
                className="dashboard-search-input"
              />
            </div>

            {/* Actions */}
            <button className="dashboard-icon-btn" title="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="dashboard-icon-btn" title="Settings" onClick={() => router.push('/dashboard/settings')}>
              <Settings className="w-5 h-5" />
            </button>

            {/* User Avatar Dropdown */}
            <div className="dashboard-user-menu">
              <button className="dashboard-avatar">
                {session.user?.image ? (
                  <img src={session.user.image} alt={session.user.name} className="w-full h-full rounded-full" />
                ) : (
                  <span>{session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}</span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}