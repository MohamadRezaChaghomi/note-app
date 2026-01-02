"use client";

import Link from "next/link";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";
import "@/styles/not-found.css";

export default function GlobalNotFound() {
  return (
    <div className="global-not-found">
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
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          
          <Link href="/dashboard" className="btn-secondary">
            Go to Dashboard
          </Link>
        </div>

        <div className="not-found-help">
          <p>Need help? <Link href="/contact" className="help-link">Contact support</Link></p>
        </div>
      </div>
    </div>
  );
}