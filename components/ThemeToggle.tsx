"use client";

import { useTheme } from "next-themes";
import React from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-2 py-1 rounded-md bg-gray-100 dark:bg-neutral-900"
    >
      {theme === "dark" ? "�" : "☀️"}
    </button>
  );
}
