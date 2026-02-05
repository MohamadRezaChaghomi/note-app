"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Smartphone,
  LogOut,
  Key,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import "@/styles/security.css";

export default function SecurityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [sessions, setSessions] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, settingsRes] = await Promise.all([
        fetch("/api/security/sessions"),
        fetch("/api/security/settings"),
      ]);

      if (sessionsRes.ok) {
        const data = await sessionsRes.json();
        setSessions(data.sessions || []);
      }

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSecuritySettings(data.settings || securitySettings);
      }
    } catch (error) {
      console.error("Load security data error:", error);
      toast.error("Failed to load security data");
    } finally {
      setLoading(false);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordStrength < 60) {
      toast.error("Password is too weak");
      return;
    }

    try {
      setChangingPassword(true);
      const res = await fetch("/api/security/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength(0);
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogoutSession = async (sessionId) => {
    if (!confirm("Are you sure you want to logout this session?")) return;

    try {
      const res = await fetch(`/api/security/sessions/${sessionId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to logout session");
      }

      toast.success("Session logged out");
      loadSecurityData();
    } catch (error) {
      toast.error(error.message || "Failed to logout session");
    }
  };

  const handleLogoutAllSessions = async () => {
    if (!confirm("Are you sure? You will be logged out from all sessions.")) return;

    try {
      const res = await fetch("/api/security/sessions", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to logout all sessions");
      }

      toast.success("All sessions logged out");
      setTimeout(() => router.push("/auth/login"), 1000);
    } catch (error) {
      toast.error(error.message || "Failed to logout all sessions");
    }
  };

  const toggleSetting = async (setting) => {
    try {
      const newSettings = {
        ...securitySettings,
        [setting]: !securitySettings[setting],
      };

      const res = await fetch("/api/security/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [setting]: !securitySettings[setting] }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update settings");
      }

      setSecuritySettings(newSettings);
      toast.success("Setting updated");
    } catch (error) {
      toast.error(error.message || "Failed to update settings");
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "#ef4444";
    if (passwordStrength < 60) return "#f97316";
    if (passwordStrength < 80) return "#eab308";
    return "#22c55e";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "Enter password";
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  if (loading) {
    return (
      <div className="security-page">
        <div className="security-container">
          <div className="security-loading">
            <Loader2 className="security-loader-icon" />
            <p>Loading security settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="security-page">
      <div className="security-container">
        {/* Header */}
        <div className="security-header">
          <div className="security-header-content">
            <Shield className="security-header-icon" />
            <div className="security-header-text">
              <h1>Security</h1>
              <p>Manage your account security and sessions</p>
            </div>
          </div>
        </div>

        <div className="security-content">
          {/* Change Password Section */}
          <div className="security-section">
            <div className="security-section-header">
              <Lock className="security-section-icon" />
              <div className="security-section-title">
                <h2>Change Password</h2>
                <p>Update your password to keep your account secure</p>
              </div>
            </div>

            <div className="security-section-content">
              {/* Current Password */}
              <div className="security-input-group">
                <label className="security-label">Current Password</label>
                <div className="security-input-wrapper">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="security-input"
                    placeholder="Enter your current password"
                  />
                  <button
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    className="security-toggle-btn"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="security-toggle-icon" />
                    ) : (
                      <Eye className="security-toggle-icon" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="security-input-group">
                <label className="security-label">New Password</label>
                <div className="security-input-wrapper">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="security-input"
                    placeholder="Enter your new password"
                  />
                  <button
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                    className="security-toggle-btn"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="security-toggle-icon" />
                    ) : (
                      <Eye className="security-toggle-icon" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="security-strength-indicator">
                    <div className="security-strength-bar">
                      <div
                        className="security-strength-fill"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor(),
                        }}
                      />
                    </div>
                    <span
                      className="security-strength-text"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="security-input-group">
                <label className="security-label">Confirm Password</label>
                <div className="security-input-wrapper">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="security-input"
                    placeholder="Confirm your new password"
                  />
                  <button
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="security-toggle-btn"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="security-toggle-icon" />
                    ) : (
                      <Eye className="security-toggle-icon" />
                    )}
                  </button>
                </div>

                {passwordData.confirmPassword && (
                  <div
                    className={`security-match-indicator ${
                      passwordData.newPassword === passwordData.confirmPassword
                        ? "match"
                        : "mismatch"
                    }`}
                  >
                    {passwordData.newPassword === passwordData.confirmPassword ? (
                      <>
                        <Check className="security-match-icon" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="security-match-icon" />
                        <span>Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="security-primary-btn"
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="security-btn-icon" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Key className="security-btn-icon" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="security-section">
            <div className="security-section-header">
              <Smartphone className="security-section-icon" />
              <div className="security-section-title">
                <h2>Active Sessions</h2>
                <p>Manage your active sessions and devices</p>
              </div>
            </div>

            <div className="security-sessions-list">
              {sessions.length === 0 ? (
                <div className="security-empty-state">
                  <p>No active sessions found</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div key={session._id} className="security-session-item">
                    <div className="security-session-info">
                      <div className="security-session-header">
                        <h3 className="security-session-device">
                          {session.device || "Unknown Device"}
                        </h3>
                        {session.isCurrent && (
                          <span className="security-session-current">Current</span>
                        )}
                      </div>
                      <p className="security-session-location">
                        {session.location || "Unknown location"}
                      </p>
                      <div className="security-session-meta">
                        <span className="security-session-meta-item">
                          <Clock className="security-meta-icon" />
                          {new Date(session.lastActivity).toLocaleDateString()}
                        </span>
                        <span className="security-session-meta-item">
                          <CheckCircle className="security-meta-icon" />
                          {new Date(session.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        onClick={() => handleLogoutSession(session._id)}
                        className="security-logout-btn"
                      >
                        <LogOut className="security-logout-icon" />
                        Logout
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {sessions.length > 1 && (
              <button
                onClick={handleLogoutAllSessions}
                className="security-danger-btn"
              >
                <LogOut className="security-btn-icon" />
                Logout All Sessions
              </button>
            )}
          </div>

          {/* Security Settings */}
          <div className="security-section">
            <div className="security-section-header">
              <AlertTriangle className="security-section-icon" />
              <div className="security-section-title">
                <h2>Security Settings</h2>
                <p>Configure security notifications and alerts</p>
              </div>
            </div>

            <div className="security-settings-list">
              <div className="security-setting-item">
                <div className="security-setting-info">
                  <h3 className="security-setting-title">Login Notifications</h3>
                  <p className="security-setting-description">
                    Get notified when your account is accessed
                  </p>
                </div>
                <label className="security-toggle">
                  <input
                    type="checkbox"
                    checked={securitySettings.loginNotifications}
                    onChange={() => toggleSetting("loginNotifications")}
                    className="security-toggle-input"
                  />
                  <span className="security-toggle-slider" />
                </label>
              </div>

              <div className="security-setting-item">
                <div className="security-setting-info">
                  <h3 className="security-setting-title">
                    Suspicious Activity Alerts
                  </h3>
                  <p className="security-setting-description">
                    Receive alerts for unusual account activity
                  </p>
                </div>
                <label className="security-toggle">
                  <input
                    type="checkbox"
                    checked={securitySettings.suspiciousActivityAlerts}
                    onChange={() => toggleSetting("suspiciousActivityAlerts")}
                    className="security-toggle-input"
                  />
                  <span className="security-toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
