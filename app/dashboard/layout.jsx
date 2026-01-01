"use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
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

      {/* Header (full width) */}
      <header className="dashboard-header">
        <div className="flex items-center gap-4 container">
          <div className="flex items-center gap-4" style={{flex:1}}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
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
              <AvatarMenu session={session} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Content Area */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}

    function AvatarMenu({ session }) {
      const [open, setOpen] = useState(false);
      const ref = useRef(null);
      const router = useRouter();

      useEffect(() => {
        function onDoc(e) {
          if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("click", onDoc);
        return () => document.removeEventListener("click", onDoc);
      }, []);

      return (
        <div className="relative" ref={ref}>
          <button
            className="dashboard-avatar"
            onClick={() => setOpen((s) => !s)}
            aria-haspopup="true"
            aria-expanded={open}
            title="Account menu"
          >
            {session.user?.image ? (
              <img src={session.user.image} alt={session.user.name} className="w-full h-full rounded-full" />
            ) : (
              <span>{session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}</span>
            )}
          </button>

          {open && (
            <div className="absolute left-0 rtl:left-auto rtl:right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-40">
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setOpen(false);
                  router.push('/dashboard/settings');
                }}
              >
                <Settings className="inline-block mr-2 w-4 h-4 align-middle" /> Settings
              </button>
              <hr className="border-t my-1 border-gray-100 dark:border-gray-700" />
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="inline-block mr-2 w-4 h-4 align-middle" /> Sign out
              </button>
            </div>
          )}
        </div>
      );
    }