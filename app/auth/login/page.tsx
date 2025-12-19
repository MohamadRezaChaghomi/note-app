"use client";

import { signIn } from "next-auth/react";
import AuthNavbar from "@/components/AuthNavbar";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  }

  return (
    <div className="auth-layout">
      <AuthNavbar />
      <div className="auth-container">
        <div className="auth-card fade-in">
          <h2 className="auth-title">ورود</h2>
          <p className="auth-subtitle">اطلاعات خود را وارد کنید</p>

          <form onSubmit={handleLogin} className="auth-form">
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

            <button type="submit" className="auth-button">
              ورود
            </button>
          </form>

          <div className="auth-link">
            حساب ندارید؟ <Link href="/auth/register">ثبت نام کنید</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
