"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SessionTimeout from "@/components/ui/SessionTimeout";
import MobileMenu from "@/components/ui/MobileMenu";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import QuickActions from "@/components/ui/QuickActions";
import Notifications from "@/components/ui/Notifications";
import SearchBar from "@/components/ui/SearchBar";
import UserMenu from "@/components/ui/UserMenu";
import { Toaster } from "sonner";
import "@/styles/dashboard.css";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* Session Timeout */}
      <SessionTimeout />
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={sidebarOpen && isMobile}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      {!isMobile && (
        <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : 'closed'}`}>
          <Sidebar />
        </div>
      )}
      
      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation */}
        <header className="dashboard-header">
          <div className="header-left">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="mobile-menu-button"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <Breadcrumbs />
          </div>
          
          <div className="header-center">
            <SearchBar 
              isOpen={searchOpen}
              onToggle={() => setSearchOpen(!searchOpen)}
            />
          </div>
          
          <div className="header-right">
            <QuickActions />
            
            <Notifications 
              isOpen={notificationsOpen}
              onToggle={() => setNotificationsOpen(!notificationsOpen)}
            />
            
            <ThemeToggle />
            
            <UserMenu user={session.user} />
          </div>
        </header>
        
        {/* Main Content Area */}
        <main className="dashboard-main">
          {/* Background Effects */}
          <div className="background-effects">
            <div className="bg-gradient-1" />
            <div className="bg-gradient-2" />
            <div className="bg-gradient-3" />
          </div>
          
          {/* Page Content */}
          <div className="page-content">
            {children}
          </div>
        </main>
        
        {/* Floating Action Button */}
        {pathname === "/dashboard/notes" && (
          <button
            onClick={() => router.push("/dashboard/notes/new")}
            className="floating-action-btn"
            aria-label="Create new note"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
        
        {/* Global Toaster */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "dashboard-toast",
              title: "toast-title",
              description: "toast-description",
              actionButton: "toast-action-btn",
              cancelButton: "toast-cancel-btn",
            },
          }}
        />
      </div>
      
      {/* Overlay */}
      {(sidebarOpen && isMobile) && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}