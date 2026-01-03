import {
  Folder,
  FileText,
  Archive,
  FolderOpen,
  BarChart,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import "@styles/components/folders/FolderStats.module.css";
export default function FolderStats({ stats }) {
  if (!stats) return null;

  const statsCards = [
    {
      title: "Total Folders",
      value: stats.total,
      icon: Folder,
      color: "blue",
      change: "+12%",
    },
    {
      title: "With Notes",
      value: stats.foldersWithNotes,
      icon: FileText,
      color: "green",
      change: "+8%",
    },
    {
      title: "Empty Folders",
      value: stats.emptyFolders,
      icon: FolderOpen,
      color: "gray",
      change: "-3%",
    },
    {
      title: "Archived",
      value: stats.archived,
      icon: Archive,
      color: "amber",
      change: "+5%",
    },
    {
      title: "Total Notes",
      value: stats.totalNotes,
      icon: FileText,
      color: "purple",
      change: "+15%",
    },
  ];

  const getColorClass = (color) => {
    const colors = {
      blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
      green: "text-green-600 bg-green-50 dark:bg-green-900/20",
      gray: "text-gray-600 bg-gray-50 dark:bg-gray-800",
      amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
      purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="folder-stats-container">
      <div className="stats-header">
        <div className="header-title">
          <BarChart className="w-5 h-5" />
          <h3>Folder Statistics</h3>
        </div>
        <div className="header-update">
          <Clock className="w-4 h-4" />
          <span>Updated just now</span>
        </div>
      </div>

      <div className="stats-grid">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <div className={`stat-icon ${getColorClass(stat.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="stat-change">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {stats.sizeDistribution && stats.sizeDistribution.length > 0 && (
        <div className="distribution-section">
          <h4>Folder Size Distribution</h4>
          <div className="distribution-chart">
            {stats.sizeDistribution.map((bucket, index) => (
              <div key={index} className="distribution-bar">
                <div className="bar-label">{bucket._id}</div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(bucket.count / stats.total) * 100}%`,
                      backgroundColor: `hsl(${index * 40}, 70%, 50%)`,
                    }}
                  />
                </div>
                <div className="bar-value">{bucket.count} folders</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}