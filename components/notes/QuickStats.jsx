"use client";

import { Star, Archive, Trash2, Pin, Zap, Users } from "lucide-react";
import "@styles/components/notes/quick-stats.module.css";

export default function QuickStats({ stats }) {
  const statItems = [
    {
      icon: Star,
      label: "Starred",
      value: stats.starred,
      color: "text-yellow-600 bg-yellow-50",
      darkColor: "dark:text-yellow-400 dark:bg-yellow-900/20"
    },
    {
      icon: Pin,
      label: "Pinned",
      value: stats.pinned,
      color: "text-blue-600 bg-blue-50",
      darkColor: "dark:text-blue-400 dark:bg-blue-900/20"
    },
    {
      icon: Archive,
      label: "Archived",
      value: stats.archived,
      color: "text-gray-600 bg-gray-50",
      darkColor: "dark:text-gray-400 dark:bg-gray-800"
    },
    {
      icon: Trash2,
      label: "Trashed",
      value: stats.trashed,
      color: "text-red-600 bg-red-50",
      darkColor: "dark:text-red-400 dark:bg-red-900/20"
    }
  ];

  return (
    <div className="quick-stats">
      {statItems.map((item, index) => (
        <div
          key={index}
          className={`stat-item ${item.color} ${item.darkColor}`}
        >
          <div className="stat-icon">
            <item.icon className="w-4 h-4" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{item.value.toLocaleString()}</div>
            <div className="stat-label">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}