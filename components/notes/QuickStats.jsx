"use client";
import styles from "@styles/components/notes/quick-stats.module.css";

import { FileText, Star, Archive, Clock, TrendingUp, Eye, Users } from "lucide-react";

export default function QuickStats({ stats }) {
  const statItems = [
    {
      label: "Total Notes",
      value: stats.total,
      icon: FileText,
      color: "blue",
      trend: "+12%",
      trendUp: true
    },
    {
      label: "Starred",
      value: stats.starred,
      icon: Star,
      color: "yellow",
      trend: "+8%",
      trendUp: true
    },
    {
      label: "Archived",
      value: stats.archived,
      icon: Archive,
      color: "gray",
      trend: "-3%",
      trendUp: false
    },
    {
      label: "This Week",
      value: stats.week,
      icon: Clock,
      color: "green",
      trend: "+25%",
      trendUp: true
    },
    {
      label: "Views",
      value: "1.2k",
      icon: Eye,
      color: "purple",
      trend: "+18%",
      trendUp: true
    },
    {
      label: "Shared",
      value: stats.shared || 0,
      icon: Users,
      color: "pink",
      trend: "+5%",
      trendUp: true
    }
  ];

  return (
    <div className={styles["quick-stats"]}>
      <div className={styles["stats-header"]}>
        <h3 className={styles["stats-title"]}>Overview</h3>
        <div className={styles["stats-subtitle"]}>Last 30 days</div>
      </div>
      
      <div className={styles["stats-grid"]}>
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`${styles["stat-card"]} ${styles[item.color]}`}>
              <div className={styles["stat-header"]}>
                <div className={styles["stat-icon"]}>
                  <Icon size={20} />
                </div>
                <div className={styles["stat-trend"]}>
                  <span className={`${styles["trend-indicator"]} ${styles[item.trendUp ? 'up' : 'down']}`}>
                    {item.trend}
                  </span>
                </div>
              </div>
              
              <div className={styles["stat-content"]}>
                <div className={styles["stat-value"]}>
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </div>
                <div className={styles["stat-label"]}>{item.label}</div>
              </div>
              
              <div className={styles["stat-progress"]}>
                <div 
                  className={styles["progress-bar"]}
                  style={{ 
                    width: `${Math.min((item.value / stats.total) * 300, 100)}%`,
                    backgroundColor: `var(--color-${item.color}-500)`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}