"use client";

import AuthNavbar from "@/components/AuthNavbar";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "خطایی رخ داد");
        return;
      }

      // Redirect to login on success
      window.location.href = "/auth/login";
    } catch (err) {
      setError("خطایی رخ داد");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <AuthNavbar />
      <div className="auth-container">
        <div className="auth-card fade-in">
          <h2 className="auth-title">ثبت نام</h2>
          <p className="auth-subtitle">حساب جدید ایجاد کنید</p>

          {error && (
            <div style={{ 
              padding: "10px 12px", 
              marginBottom: "16px", 
              borderRadius: "8px", 
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              fontSize: "0.9rem"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="name">نام کامل</label>
              <input
                id="name"
                type="text"
                className="auth-input"
                placeholder="علی رضایی"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="email">ایمیل</label>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="password">رمز عبور</label>
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "درحال ثبت نام..." : "ثبت نام"}
            </button>
          </form>

          <div className="auth-link">
            قبلاً ثبت نام کردید؟ <Link href="/auth/login">وارد شوید</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
