import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({
  onSearch,
}: {
  onSearch?: (q: string) => void;
}) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b dark:border-neutral-800 bg-transparent">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">نوت‌اپ</h1>
      </div>

      <div className="flex items-center gap-3 flex-1 mx-4">
        <input
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="جستجو در یادداشت‌ها"
          className="flex-1 px-3 py-2 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        />
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => onSearch?.("")} className="text-sm px-3 py-1">باز کردن</button>
  <button onClick={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: { mode: 'register' } }))} className="text-sm px-3 py-1">ثبت‌نام</button>
  <button onClick={() => window.dispatchEvent(new CustomEvent('open-auth', { detail: { mode: 'login' } }))} className="text-sm px-3 py-1">ورود</button>
        <ThemeToggle />
        <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => window.dispatchEvent(new CustomEvent('open-add-note'))}>+</button>
      </div>
    </header>
  );
}
