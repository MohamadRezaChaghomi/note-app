"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ onSearch }: { onSearch?: (q: string) => void; showBack?: boolean }) {
  const router = useRouter();

  return (
    <header className="app-header">
      <div className="navbar-left">
        <h1 className="app-title">نوت‌اپ</h1>
      </div>

      <div className="navbar-search">
        <input
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="جستجو در یادداشت‌ها"
          className="input"
        />
      </div>

      <div className="navbar-actions">
        <button onClick={() => onSearch?.("")} className="btn btn-ghost">باز کردن</button>
        <Link href="/auth/register" className="btn btn-ghost">ثبت‌نام</Link>
        <Link href="/auth/login" className="btn btn-ghost">ورود</Link>
        <button className="btn btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("open-add-note"))}>+</button>
      </div>
    </header>
  );
}
