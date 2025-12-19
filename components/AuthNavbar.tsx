"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function AuthNavbar() {
  const router = useRouter();

  return (
    <header className="app-header ">
      <div className="navbar-container">
        <div className="navbar-start">
          <Link href="/" className="navbar-logo-link">
            <span className="navbar-logo">📓</span>
          </Link>
        </div>

        <div className="navbar-end">
          <ThemeToggle />
          <button 
            onClick={() => router.back()} 
            className="btn btn-ghost"
          >
            ← بازگشت
          </button>
        </div>
      </div>
    </header>
  );
}
