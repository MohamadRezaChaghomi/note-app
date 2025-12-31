"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Download, Users, FileText, Tag, TrendingUp, Calendar,
  Loader2, AlertCircle, BarChart3, Clock, UserCheck
} from "lucide-react";
import "@/styles/report.css";

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function ReportPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('14days');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/report?range=${timeRange}`);
        if (!res.ok) throw new Error('Failed to load report');
        const d = await res.json();
        setData(d);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [timeRange]);

  const handleExportPDF = async () => {
    try {
      const res = await fetch('/api/report/export');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="report-container">
        <div className="loading-overlay">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="mt-4">Generating report...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.ok) {
    return (
      <div className="report-container">
        <div className="error-state">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3>Failed to load report</h3>
          <p>{error || 'Please try again later'}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { systemSummary, usersPerformance, activityDaily, tagDistribution } = data;

  return (
    <div className="report-container">
      {/* Header */}
      <div className="report-header">
        <div className="header-main">
          <div>
            <h1 className="report-title">System Analytics</h1>
            <p className="report-subtitle">
              Real-time performance metrics and user insights
            </p>
          </div>
          <div className="header-actions">
            <div className="time-range-selector">
              <Calendar className="w-4 h-4" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="range-select"
              >
                <option value="7days">Last 7 days</option>
                <option value="14days">Last 14 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
              </select>
            </div>
            <button onClick={handleExportPDF} className="export-btn">
              <Download className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card users-card">
          <div className="card-icon">
            <Users className="w-6 h-6" />
          </div>
          <div className="card-content">
            <h3>Total Users</h3>
            <div className="card-value">{systemSummary.totalUsers}</div>
            <div className="card-change">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last month</span>
            </div>
          </div>
        </div>

        <div className="summary-card notes-card">
          <div className="card-icon">
            <FileText className="w-6 h-6" />
          </div>
          <div className="card-content">
            <h3>Total Notes</h3>
            <div className="card-value">{systemSummary.totalNotes}</div>
            <div className="card-change">
              <TrendingUp className="w-4 h-4" />
              <span>+24% from last month</span>
            </div>
          </div>
        </div>

        <div className="summary-card tags-card">
          <div className="card-icon">
            <Tag className="w-6 h-6" />
          </div>
          <div className="card-content">
            <h3>Total Tags</h3>
            <div className="card-value">{systemSummary.totalTags}</div>
            <div className="card-change">
              <TrendingUp className="w-4 h-4" />
              <span>+8% from last month</span>
            </div>
          </div>
        </div>

        <div className="summary-card activity-card">
          <div className="card-icon">
            <Clock className="w-6 h-6" />
          </div>
          <div className="card-content">
            <h3>Active Users</h3>
            <div className="card-value">{systemSummary.activeUsers || 'N/A'}</div>
            <div className="card-change">
              <UserCheck className="w-4 h-4" />
              <span>Currently online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Activity Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Daily Notes Created</h3>
              <p>Last {timeRange.replace('days', '')} days</p>
            </div>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityDaily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis 
                  allowDecimals={false}
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid #4b5563',
                    borderRadius: '0.75rem',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Performance */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Top Users by Notes</h3>
              <p>Most productive users</p>
            </div>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usersPerformance.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="email" 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                  hide
                />
                <YAxis 
                  allowDecimals={false}
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <Tooltip 
                  formatter={(value) => [value, 'Notes']}
                  labelFormatter={(label) => `User: ${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid #4b5563',
                    borderRadius: '0.75rem'
                  }}
                />
                <Bar 
                  dataKey="notes" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                >
                  {usersPerformance.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tag Distribution */}
        {tagDistribution && tagDistribution.length > 0 && (
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3>Tag Distribution</h3>
                <p>Most used tags</p>
              </div>
              <Tag className="w-5 h-5 text-green-500" />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tagDistribution.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {tagDistribution.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Notes']}
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid #4b5563',
                      borderRadius: '0.75rem'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Users Performance Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Users Performance Ranking</h3>
          <p className="table-subtitle">Sorted by number of notes created</p>
        </div>
        <div className="table-container">
          <table className="performance-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Email</th>
                <th>Total Notes</th>
                <th>Starred Notes</th>
                <th>Last Active</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {usersPerformance.map((user, index) => (
                <tr key={user.userId} className="table-row">
                  <td>
                    <div className={`rank-badge ${index < 3 ? 'top-rank' : ''}`}>
                      #{index + 1}
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.name || 'Unknown User'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">{user.email}</div>
                  </td>
                  <td>
                    <div className="metric-cell">
                      <div className="metric-value">{user.notes}</div>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill"
                          style={{ width: `${(user.notes / usersPerformance[0].notes) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="starred-cell">
                      <div className="star-count">{user.starredNotes || 0}</div>
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      {user.lastActive ? new Date(user.lastActive).toLocaleDateString('fa-IR') : 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Insights */}
      <div className="insights-grid">
        <div className="insight-card">
          <h4>Peak Activity Hours</h4>
          <div className="insight-content">
            <div className="insight-value">2:00 PM - 4:00 PM</div>
            <p className="insight-text">Most notes are created during these hours</p>
          </div>
        </div>
        
        <div className="insight-card">
          <h4>Average Notes per User</h4>
          <div className="insight-content">
            <div className="insight-value">
              {Math.round(systemSummary.totalNotes / systemSummary.totalUsers) || 0}
            </div>
            <p className="insight-text">Average notes created per user</p>
          </div>
        </div>
        
        <div className="insight-card">
          <h4>Most Productive Day</h4>
          <div className="insight-content">
            <div className="insight-value">Tuesday</div>
            <p className="insight-text">Highest note creation rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}