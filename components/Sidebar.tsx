"use client";

import React from "react";
import ThemeToggle from "./ThemeToggle";

type FolderItem = {
  id: string;
  name: string;
  count?: number;
};

export default function Sidebar({
  folders,
  selected,
  onSelect,
  className = "",
}: {
  folders: FolderItem[];
  selected?: string;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  return (
    <aside className={`sidebar ${className}`}>
      <div className="sidebar-header">
        <h2 className="folder-title">فولدرها</h2>
        <ThemeToggle />
      </div>

      <nav className="sidebar-nav">
        <ul className="folder-list">
          {folders.map((f) => (
            <li
              key={f.id}
              onClick={() => onSelect?.(f.id)}
              className={`folder-item ${selected === f.id ? 'selected' : ''}`}
            >
              <span>{f.name}</span>
              <span className="folder-count">{f.count ?? 0}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="w-full text-left py-2" onClick={() => onSelect?.("__add_folder__")}>افزودن فولدر</button>
      </div>
    </aside>
  );
}
