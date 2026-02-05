"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar, ArrowLeft, Edit2 } from "lucide-react";
import "@/styles/profile.css";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <button 
            onClick={() => router.back()} 
            className="back-btn"
            title="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1>Profile</h1>
          <div style={{ width: 40 }} />
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar-fallback">
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="profile-info">
            {/* Name */}
            <div className="profile-item">
              <div className="profile-item-icon">
                <User size={20} />
              </div>
              <div className="profile-item-content">
                <label className="profile-item-label">Full Name</label>
                <p className="profile-item-value">{session.user.name || "Not set"}</p>
              </div>
            </div>

            {/* Email */}
            <div className="profile-item">
              <div className="profile-item-icon">
                <Mail size={20} />
              </div>
              <div className="profile-item-content">
                <label className="profile-item-label">Email Address</label>
                <p className="profile-item-value">{session.user.email || "Not set"}</p>
              </div>
            </div>

            {/* Role */}
            <div className="profile-item">
              <div className="profile-item-icon">
                <Shield size={20} />
              </div>
              <div className="profile-item-content">
                <label className="profile-item-label">Account Type</label>
                <p className="profile-item-value capitalize">
                  {session.user.role || "User"}
                </p>
              </div>
            </div>

            {/* Join Date */}
            <div className="profile-item">
              <div className="profile-item-icon">
                <Calendar size={20} />
              </div>
              <div className="profile-item-content">
                <label className="profile-item-label">Member Since</label>
                <p className="profile-item-value">
                  {session.user.createdAt ? formatDate(session.user.createdAt) : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="profile-btn primary"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
            <button
              onClick={() => router.push("/dashboard/security")}
              className="profile-btn secondary"
            >
              <Shield size={18} />
              Security Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
