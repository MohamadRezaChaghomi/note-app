"use client";

import React, { useState } from "react";
import Modal from "./Modal";

export default function AuthModal({ open, onClose, mode }: { open: boolean; onClose: () => void; mode: "login" | "register"; }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // For now just close - real auth handled by NextAuth
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === "login" ? "ورود" : "ثبت‌نام"}>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="ایمیل" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full px-3 py-2 border rounded" placeholder="رمز عبور" />
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">{mode === "login" ? "ورود" : "ثبت‌نام"}</button>
        </div>
      </form>
    </Modal>
  );
}
