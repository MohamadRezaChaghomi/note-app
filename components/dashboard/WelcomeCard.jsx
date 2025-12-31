// components/dashboard/WelcomeCard.jsx
"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Target, TrendingUp, 
  Clock, Award, Sparkles,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function WelcomeCard({ user, greeting, stats }) {
  const [currentTime, setCurrentTime] = useState("");
  const [motivation, setMotivation] = useState("");

  const motivations = [
    "Small notes lead to big ideas.",
    "Consistency is the key to mastery.",
    "Your thoughts matter. Keep writing.",
    "Every note brings you one step closer.",
    "Organize your mind, transform your life."
  ];

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setCurrentTime(timeString);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    // Set random motivation
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    setMotivation(randomMotivation);
    
    return () => clearInterval(interval);
  }, []);

  const userStats = [
    {
      icon: Calendar,
      label: "Days Active",
      value: stats?.daysActive || 0,
      color: "text-blue-600 bg-blue-100"
    },
    {
      icon: Target,
      label: "Goals Set",
      value: stats?.goalsSet || 0,
      color: "text-green-600 bg-green-100"
    },
    {
      icon: TrendingUp,
      label: "Productivity",
      value: `${stats?.productivity || 0}%`,
      color: "text-purple-600 bg-purple-100"
    },
    {
      icon: Clock,
      label: "Avg Time/Day",
      value: `${stats?.avgTime || 0}m`,
      color: "text-orange-600 bg-orange-100"
    }
  ];

  return (
    <div className="welcome-card">
      <style jsx>{`
        .welcome-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 1rem;
          padding: 2rem;
          color: white;
          margin-bottom: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .welcome-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          animation: shine 3s infinite linear;
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .welcome-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        
        .welcome-text h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        
        .welcome-text p {
          opacity: 0.9;
          font-size: 1.125rem;
        }
        
        .time-display {
          text-align: right;
          font-size: 1.125rem;
          font-weight: 600;
          opacity: 0.9;
        }
        
        .motivation {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(10px);
        }
        
        .motivation svg {
          flex-shrink: 0;
        }
        
        .motivation p {
          font-size: 0.875rem;
          opacity: 0.9;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          backdrop-filter: blur(10px);
        }
        
        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
        }
        
        .stat-content {
          flex: 1;
        }
        
        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.125rem;
        }
        
        .stat-label {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        
        .cta-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .daily-goal {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          backdrop-filter: blur(10px);
          flex: 1;
        }
        
        .goal-progress {
          flex: 1;
        }
        
        .goal-text {
          font-size: 0.875rem;
          opacity: 0.9;
          margin-bottom: 0.25rem;
        }
        
        .progress-bar {
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: #10b981;
          border-radius: 2px;
          transition: width 1s ease;
        }
        
        .cta-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <div className="welcome-header">
        <div className="welcome-text">
          <h1>{greeting}, {user?.name || "Friend"}! 👋</h1>
          <p>Here's what's happening with your notes today.</p>
        </div>
        
        <div className="time-display">
          <div>{currentTime}</div>
          <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>
      
      <div className="motivation">
        <Sparkles className="w-4 h-4" />
        <p>{motivation}</p>
      </div>
      
      <div className="stats-grid">
        {userStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-item">
              <div className={`stat-icon ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="cta-section">
        <div className="daily-goal">
          <Award className="w-5 h-5" />
          <div className="goal-progress">
            <div className="goal-text">Daily Writing Goal</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min(stats?.dailyGoalProgress || 0, 100)}%` }}
              ></div>
            </div>
          </div>
          <span>{stats?.dailyGoalProgress || 0}%</span>
        </div>
        
        <Link href="/dashboard/notes/new" className="cta-button">
          Start Writing
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}