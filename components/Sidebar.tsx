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
    <aside
      className={
        "w-64 bg-white dark:bg-[#070707] border-r dark:border-neutral-800 p-4 flex flex-col space-y-4 " +
        className
      }
    >
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">فولدرها</h2>
        <ThemeToggle />
      </div>

      <nav className="flex-1 overflow-auto">
        <ul className="space-y-2">
          {folders.map((f) => (
            <li
              key={f.id}
              onClick={() => onSelect?.(f.id)}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                selected === f.id
                  ? "bg-blue-50 dark:bg-neutral-900 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-neutral-900"
              }`}
            >
              <span>{f.name}</span>
              <span className="text-xs text-gray-400">{f.count ?? 0}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-2 border-t dark:border-neutral-800 text-sm text-gray-500">
        <button className="w-full text-left py-2" onClick={() => onSelect?.("__add_folder__")}>افزودن فولدر</button>
      </div>
    </aside>
  );
}
