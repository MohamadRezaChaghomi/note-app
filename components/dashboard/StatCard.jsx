// components/dashboard/StatCard.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change, 
  href, 
  delay = 0 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const end = value;
      const duration = 1500;
      const incrementTime = 16;
      const steps = duration / incrementTime;
      const increment = end / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedValue(end);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(start));
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  const changeColor = change >= 0 ? "text-green-600" : "text-red-600";
  const changeIcon = change >= 0 ? "↑" : "↓";

  return (
    <Link 
      href={href}
      className={`stat-card ${isVisible ? 'stat-card-visible' : ''}`}
    >
      <style jsx>{`
        .stat-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          color: white;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          text-decoration: none;
          display: block;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .stat-card-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .stat-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, ${color});
        }
        
        .stat-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          ${changeColor}
        }
        
        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-feature-settings: "tnum";
        }
        
        .stat-title {
          font-size: 0.875rem;
          opacity: 0.9;
          margin-bottom: 0.5rem;
        }
        
        .stat-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .stat-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        
        .stat-link:hover {
          opacity: 1;
        }
        
        .stat-date {
          font-size: 0.75rem;
          opacity: 0.6;
        }
      `}</style>

      <div className="stat-header">
        <div className="stat-icon-wrapper">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="stat-change">
          <span>{changeIcon}</span>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      
      <div className="stat-value">
        {animatedValue.toLocaleString()}
      </div>
      
      <div className="stat-title">{title}</div>
      
      <div className="stat-footer">
        <span className="stat-link">
          View details
          <ChevronRight className="w-4 h-4" />
        </span>
        <span className="stat-date">vs last month</span>
      </div>
    </Link>
  );
}