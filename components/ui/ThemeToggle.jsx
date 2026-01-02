"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import "@/styles/theme-toggle.css";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme) {
      const currentTheme = theme === "system" ? systemTheme : theme;
      setIsDark(currentTheme === "dark");
      
      if (currentTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, systemTheme]);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("webnotes-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("webnotes-theme", "light");
    }
  };

  if (!mounted) {
    return <div className="theme-toggle-skeleton" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "روشن کنید" : "تیره کنید"}
    >
      <div className="theme-toggle-content">
        <Sun 
          size={18}
          className={`theme-icon theme-icon-sun ${isDark ? 'hidden' : 'visible'}`}
        />
        <Moon 
          size={18}
          className={`theme-icon theme-icon-moon ${!isDark ? 'hidden' : 'visible'}`}
        />
      </div>
    </button>
  );
}