"use client";

import Link from "next/link";
import { Home, AlertTriangle, ArrowLeft, Search } from "lucide-react";
import "@/styles/not-found.css";

export default function DashboardNotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-illustration">
          <div className="error-number">404</div>
          <AlertTriangle className="error-icon" />
        </div>
        
        <h1 className="not-found-title">Page Not Found</h1>
        
        <p className="not-found-message">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="not-found-actions">
          <Link href="/dashboard" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <Link href="/dashboard/notes" className="btn-secondary">
            <Home className="w-4 h-4" />
            Go to Notes
          </Link>
        </div>

        <div className="not-found-tips">
          <h3 className="tips-title">
            <Search className="w-5 h-5" />
            Quick Links
          </h3>
          <div className="tips-grid">
            <Link href="/dashboard/notes" className="tip-link">
              <div className="tip-icon">📝</div>
              <div>
                <h4>Notes</h4>
                <p>View all your notes</p>
              </div>
            </Link>
            
            <Link href="/dashboard/folders" className="tip-link">
              <div className="tip-icon">📁</div>
              <div>
                <h4>Folders</h4>
                <p>Organize your notes</p>
              </div>
            </Link>
            
            <Link href="/dashboard/search" className="tip-link">
              <div className="tip-icon">🔍</div>
              <div>
                <h4>Search</h4>
                <p>Find anything quickly</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}