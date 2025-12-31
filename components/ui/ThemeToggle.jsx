"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Sparkles } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ripple, setRipple] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleThemeChange = (newTheme) => {
    setRipple(true);
    setTheme(newTheme);
    
    // Add animation class
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
    
    // Reset ripple effect
    setTimeout(() => setRipple(false), 600);
  };

  if (!mounted) {
    return (
      <div className="theme-toggle skeleton" />
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const themes = [
    { id: "light", label: "Light", icon: Sun, description: "Bright theme" },
    { id: "dark", label: "Dark", icon: Moon, description: "Dark theme" },
    { id: "system", label: "System", icon: Monitor, description: "Follow system" },
  ];

  return (
    <div className="theme-toggle">
      {/* Ripple Effect */}
      {ripple && (
        <div className="theme-ripple" />
      )}

      <div className="theme-selector">
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = 
            (t.id === "system" && theme === "system") ||
            (t.id !== "system" && theme === t.id);
          
          return (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`theme-option ${isActive ? 'active' : ''}`}
              aria-label={`Switch to ${t.label} theme`}
              title={t.description}
            >
              <div className="theme-icon">
                <Icon className="w-4 h-4" />
              </div>
              <div className="theme-info">
                <span className="theme-label">{t.label}</span>
                {isActive && (
                  <div className="active-indicator">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}