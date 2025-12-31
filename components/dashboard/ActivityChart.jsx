// components/dashboard/ActivityChart.jsx
"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";

export default function ActivityChart({ data = [] }) {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    // If no data provided, generate sample data
    if (data.length === 0) {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const sampleData = days.map(day => ({
        day,
        value: Math.floor(Math.random() * 100) + 20,
        notes: Math.floor(Math.random() * 10) + 1
      }));
      setChartData(sampleData);
    } else {
      setChartData(data);
    }
  }, [data]);

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="activity-chart">
      <style jsx>{`
        .activity-chart {
          position: relative;
        }
        
        .chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 200px;
          padding: 1rem 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .chart-bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        
        .chart-bar {
          width: 32px;
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px 4px 0 0;
          transition: height 0.3s ease;
          position: relative;
        }
        
        .chart-bar:hover {
          opacity: 0.8;
        }
        
        .chart-bar-label {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .chart-bar-value {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          font-weight: 600;
          color: #1f2937;
          background: white;
          padding: 2px 6px;
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .chart-bar-group:hover .chart-bar-value {
          opacity: 1;
        }
        
        .chart-notes {
          font-size: 0.625rem;
          color: #9ca3af;
          margin-top: 0.25rem;
        }
        
        .chart-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .stat-total {
          text-align: center;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .stat-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #10b981;
          font-weight: 500;
        }
        
        .chart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #9ca3af;
        }
        
        .chart-empty svg {
          margin-bottom: 0.5rem;
        }
      `}</style>

      {chartData.length > 0 ? (
        <>
          <div className="chart-bars">
            {chartData.map((item, index) => (
              <div key={index} className="chart-bar-group">
                <div 
                  className="chart-bar"
                  style={{ 
                    height: `${(item.value / maxValue) * 150}px` 
                  }}
                >
                  <span className="chart-bar-value">{item.value}</span>
                </div>
                <div className="chart-bar-label">{item.day}</div>
                {item.notes && (
                  <div className="chart-notes">{item.notes} notes</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="chart-stats">
            <div className="stat-total">
              <div className="stat-value">
                {chartData.reduce((sum, d) => sum + d.value, 0)}
              </div>
              <div className="stat-label">Total Activities</div>
            </div>
            
            <div className="stat-change">
              <TrendingUp className="w-4 h-4" />
              <span>12.5% from last week</span>
            </div>
          </div>
        </>
      ) : (
        <div className="chart-empty">
          <TrendingUp className="w-8 h-8" />
          <p>No activity data available</p>
        </div>
      )}
    </div>
  );
}