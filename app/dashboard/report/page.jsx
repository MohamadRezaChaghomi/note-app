"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Download, Users, FileText, Tag, TrendingUp, Calendar,
  Loader2, AlertCircle, BarChart3, Clock, UserCheck,
  ChevronUp, ChevronDown, Minus
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import "@/styles/report.css";

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function ReportPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('14days');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/report?range=${timeRange}`);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${res.status}: Failed to load report`);
        }
        
        const d = await res.json();
        
        if (!d.ok) {
          throw new Error(d.error || 'Report generation failed');
        }
        
        setData(d);
      } catch (err) {
        console.error('Report load error:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    load();
  }, [timeRange]);

  const handleExportPDF = useCallback(async () => {
    try {
      setExporting(true);
      const res = await fetch('/api/report/export');
      
      if (!res.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      setError(`Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    fetch(`/api/report?range=${timeRange}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(d => {
        if (!d.ok) throw new Error(d.error || 'Invalid response');
        setData(d);
      })
      .catch(err => {
        console.error('Retry failed:', err);
        setError(err.message || 'Failed to load data');
      })
      .finally(() => setLoading(false));
  }, [timeRange]);

  const summaryCards = useMemo(() => [
    {
      key: 'users',
      title: 'Total Users',
      value: data?.systemSummary?.totalUsers?.toLocaleString() || '0',
      change: `${data?.systemSummary?.activeUserPercentage || 0}% active`,
      icon: Users,
      className: 'users-card',
      trend: data?.systemSummary?.activeUserPercentage > 50 ? 'up' : 
             data?.systemSummary?.activeUserPercentage > 20 ? 'neutral' : 'down'
    },
    {
      key: 'notes',
      title: 'Total Notes',
      value: data?.systemSummary?.totalNotes?.toLocaleString() || '0',
      change: `${data?.systemSummary?.notesPerDay || 0}/day`,
      icon: FileText,
      className: 'notes-card',
      trend: parseFloat(data?.systemSummary?.notesPerDay || 0) > 10 ? 'up' : 
             parseFloat(data?.systemSummary?.notesPerDay || 0) > 5 ? 'neutral' : 'down'
    },
    {
      key: 'tags',
      title: 'Total Tags',
      value: data?.systemSummary?.totalTags?.toLocaleString() || '0',
      change: `Avg ${data?.insights?.avgTagsPerNote || 0} per note`,
      icon: Tag,
      className: 'tags-card',
      trend: parseFloat(data?.insights?.avgTagsPerNote || 0) > 2 ? 'up' : 
             parseFloat(data?.insights?.avgTagsPerNote || 0) > 1 ? 'neutral' : 'down'
    },
    {
      key: 'activity',
      title: 'Active Users',
      value: data?.systemSummary?.activeUsers?.toLocaleString() || '0',
      change: 'Last 24 hours',
      icon: UserCheck,
      className: 'activity-card',
      trend: data?.systemSummary?.activeUsers > (data?.systemSummary?.totalUsers * 0.3) ? 'up' : 
             data?.systemSummary?.activeUsers > (data?.systemSummary?.totalUsers * 0.1) ? 'neutral' : 'down'
    }
  ], [data]);

  const timeRanges = useMemo(() => [
    { value: '7days', label: 'Last 7 days' },
    { value: '14days', label: 'Last 14 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' }
  ], []);

  const insights = useMemo(() => [
    {
      title: 'Peak Activity Hours',
      value: data?.insights?.peakActivity || 'N/A',
      description: 'Most notes are created during these hours',
      icon: Clock
    },
    {
      title: 'Most Productive Day',
      value: data?.insights?.mostProductiveDay || 'N/A',
      description: 'Highest note creation rate',
      icon: TrendingUp
    },
    {
      title: 'Busiest Hour',
      value: data?.insights?.busiestHour || 'N/A',
      description: 'Peak activity time',
      icon: BarChart3
    },
    {
      title: 'Avg Tags per Note',
      value: data?.insights?.avgTagsPerNote || '0',
      description: 'Average tags assigned to each note',
      icon: Tag
    }
  ], [data]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <ChevronUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ChevronDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="report-container">
        <div className="loading-overlay">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="mt-4 text-gray-600">Generating report...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error || !data?.ok) {
    return (
      <div className="report-container">
        <Card className="error-state">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load report</h3>
          <p className="text-gray-600 mb-6 max-w-md text-center">
            {error || data?.error || 'Please try again later'}
          </p>
          <Button 
            onClick={handleRetry} 
            className="retry-btn bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : 'Retry'}
          </Button>
        </Card>
      </div>
    );
  }

  const { 
    systemSummary, 
    usersPerformance = [], 
    activityDaily = [], 
    tagDistribution = [],
    insights: dataInsights
  } = data;

  // Ensure arrays are defined
  const safeUsersPerformance = Array.isArray(usersPerformance) ? usersPerformance : [];
  const safeActivityDaily = Array.isArray(activityDaily) ? activityDaily : [];
  const safeTagDistribution = Array.isArray(tagDistribution) ? tagDistribution : [];

  return (
    <div className="report-container">
      {/* Header */}
      <div className="report-header">
        <div className="header-main">
          <div>
            <h1 className="report-title">System Analytics Dashboard</h1>
            <p className="report-subtitle">
              Real-time performance metrics and user insights • 
              Data range: {systemSummary?.dataRange?.days || 14} days
            </p>
          </div>
          <div className="header-actions">
            <div className="time-range-selector">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="range-select"
                disabled={loading}
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            <Button 
              onClick={handleExportPDF} 
              className="export-btn"
              disabled={exporting || loading}
            >
              {exporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {summaryCards.map((card) => (
          <Card key={card.key} className={`summary-card ${card.className}`}>
            <div className="card-icon">
              <card.icon className="w-6 h-6" />
            </div>
            <div className="card-content">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">{card.title}</h3>
              <div className="card-value text-2xl font-bold text-gray-900 mb-2">
                {card.value}
              </div>
              <div className="card-change flex items-center gap-1 text-sm">
                {getTrendIcon(card.trend)}
                <span className={`
                  ${card.trend === 'up' ? 'text-green-600' : 
                    card.trend === 'down' ? 'text-red-600' : 'text-gray-600'}
                  font-medium
                `}>
                  {card.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Activity Chart */}
        <Card className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Notes Created</h3>
              <p className="text-gray-500 text-sm">
                Last {systemSummary?.dataRange?.days || 14} days
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={safeActivityDaily.slice(-systemSummary?.dataRange?.days || 14)}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis 
                  allowDecimals={false}
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: '#374151', fontWeight: 600 }}
                  formatter={(value, name) => {
                    const formatted = Number(value).toLocaleString();
                    return [formatted, name === 'created' ? 'Created' : name];
                  }}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    });
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, stroke: '#3b82f6', fill: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name="Notes Created"
                />
                <Line 
                  type="monotone" 
                  dataKey="updated" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                  name="Notes Updated"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Users Performance */}
        <Card className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Users by Notes</h3>
              <p className="text-gray-500 text-sm">Most productive users</p>
            </div>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={safeUsersPerformance.slice(0, 8)}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tickFormatter={(value) => value.length > 15 ? value.substring(0, 12) + '...' : value}
                />
                <YAxis 
                  allowDecimals={false}
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} notes`, 'Total Notes']}
                  labelFormatter={(label, payload) => {
                    const user = payload[0]?.payload;
                    return `User: ${user?.name || 'Unknown'}`;
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="notes" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  name="Notes Count"
                >
                  {safeUsersPerformance.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tag Distribution */}
        {safeTagDistribution.length > 0 && (
          <Card className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tag Distribution</h3>
                <p className="text-gray-500 text-sm">Most used tags</p>
              </div>
              <Tag className="w-5 h-5 text-green-500" />
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={safeTagDistribution.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                  >
                    {safeTagDistribution.slice(0, 6).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} notes (${(props.payload.percent * 100).toFixed(1)}%)`,
                      'Tag Usage'
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ paddingLeft: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Users Performance Table */}
      {safeUsersPerformance.length > 0 && (
        <Card className="table-card">
          <div className="table-header">
            <h3 className="text-xl font-semibold text-gray-900">Users Performance Ranking</h3>
            <p className="table-subtitle text-gray-500">
              Sorted by number of notes created • Showing top {safeUsersPerformance.length} users
            </p>
          </div>
          <div className="table-container">
            <table className="performance-table">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Total Notes</th>
                  <th className="text-left py-3 px-4">Starred Notes</th>
                  <th className="text-left py-3 px-4">Last Active</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {safeUsersPerformance.map((user, index) => {
                  const maxNotes = safeUsersPerformance[0]?.notes || 1;
                  const percentage = (user.notes / maxNotes) * 100;
                  const lastActiveDate = user.lastActive 
                    ? new Date(user.lastActive).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'N/A';

                  return (
                    <tr key={user.userId || index} className="table-row hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className={`rank-badge ${index < 3 ? 'top-rank' : ''}`}>
                          #{index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="user-info">
                            <div className="user-name font-medium text-gray-900">
                              {user.name || 'Unknown User'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="email-cell text-gray-600 text-sm">
                          {user.email || 'No email'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="metric-cell">
                          <div className="metric-value font-semibold text-gray-900">
                            {user.notes?.toLocaleString() || 0}
                          </div>
                          <div className="metric-bar">
                            <div 
                              className="metric-fill"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="starred-cell">
                          <div className="star-count">
                            {user.starredNotes?.toLocaleString() || 0}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="date-cell text-gray-600 text-sm">
                          {lastActiveDate}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? (
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* System Insights */}
      <div className="insights-grid">
        {insights.map((insight, index) => (
          <Card key={index} className="insight-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <insight.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">{insight.title}</h4>
            </div>
            <div className="insight-content">
              <div className="insight-value text-3xl font-bold text-gray-900 mb-2">
                {insight.value}
              </div>
              <p className="insight-text text-gray-600">
                {insight.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          Report generated at: {data.generatedAt ? new Date(data.generatedAt).toLocaleString() : 'N/A'} • 
          Data range: {systemSummary?.dataRange?.days || 14} days • 
          Version: {data.meta?.version || '1.0.0'}
        </p>
      </div>
    </div>
  );
}