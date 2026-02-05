"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell, Shield, Palette, User, Save, ArrowLeft, Users, Lock } from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import "@/styles/settings.css";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      digestEmail: "weekly"
    },
    preferences: {
      theme: "auto",
      language: "en",
      fontSize: "medium"
    },
    privacy: {
      publicProfile: false,
      allowSharing: true
    }
  });
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [nameMessage, setNameMessage] = useState(null);

  const handleSettingChange = useCallback((section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setSaved(false);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }, []);

  useEffect(() => {
    setName(session?.user?.name || "");
  }, [session?.user?.name]);

  const handleNameSave = useCallback(async () => {
    if (!name || !name.trim()) {
      setNameMessage({ ok: false, text: "Name cannot be empty" });
      return;
    }

    try {
      setSavingName(true);
      setNameMessage(null);

      const res = await fetch('/api/auth/update-name', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      });

      const json = await res.json();
      if (res.ok && json.ok) {
        setNameMessage({ ok: true, text: 'Name updated' });
        // small refresh to update session display in UI
        setTimeout(() => window.location.reload(), 600);
      } else {
        setNameMessage({ ok: false, text: json?.error || 'Update failed' });
      }
    } catch (error) {
      console.error('Update name failed:', error);
      setNameMessage({ ok: false, text: 'Update failed' });
    } finally {
      setSavingName(false);
      setTimeout(() => setNameMessage(null), 3000);
    }
  }, [name]);

  const navItems = [
    { id: "general", label: "General", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "privacy", label: "Privacy", icon: Shield },
    ...(session?.user?.role === "admin" ? [{ id: "admin", label: "Admin Panel", icon: Lock }] : [])
  ];

  const [activeSection, setActiveSection] = useState("general");

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2>General Settings</h2>
              <p>Manage your account information</p>
            </div>

            <div className="setting-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={session?.user?.email || ""}
                disabled
                className="setting-input"
              />
            </div>

            <div className="setting-group">
              <label htmlFor="name">Full Name</label>
              <div className="name-row">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="setting-input"
                />
                <Button onClick={handleNameSave} disabled={savingName} className="btn-inline-save">
                  {savingName ? 'Saving...' : 'Save Name'}
                </Button>
              </div>
              {nameMessage && (
                <div className={`name-msg ${nameMessage.ok ? 'ok' : 'error'}`}>{nameMessage.text}</div>
              )}
              <div className="change-password-row">
                <Link href="/auth/reset-password" className="change-password-link">Change Password</Link>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2>Notification Preferences</h2>
              <p>Control how you receive notifications</p>
            </div>

            <div className="setting-group">
              <div className="setting-toggle">
                <label>Email Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) =>
                    handleSettingChange(
                      "notifications",
                      "emailNotifications",
                      e.target.checked
                    )
                  }
                  className="toggle-input"
                />
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-toggle">
                <label>Push Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) =>
                    handleSettingChange(
                      "notifications",
                      "pushNotifications",
                      e.target.checked
                    )
                  }
                  className="toggle-input"
                />
              </div>
            </div>

            <div className="setting-group">
              <label htmlFor="digest">Digest Email</label>
              <select
                id="digest"
                value={settings.notifications.digestEmail}
                onChange={(e) =>
                  handleSettingChange("notifications", "digestEmail", e.target.value)
                }
                className="setting-input"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2>Appearance</h2>
              <p>Customize how Web Notes looks</p>
            </div>

            <div className="setting-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={settings.preferences.theme}
                onChange={(e) =>
                  handleSettingChange("preferences", "theme", e.target.value)
                }
                className="setting-input"
              >
                <option value="auto">System (Auto)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="fontSize">Font Size</label>
              <select
                id="fontSize"
                value={settings.preferences.fontSize}
                onChange={(e) =>
                  handleSettingChange("preferences", "fontSize", e.target.value)
                }
                className="setting-input"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2>Privacy & Security</h2>
              <p>Control your privacy settings</p>
            </div>

            <div className="setting-group">
              <div className="setting-toggle">
                <label>Public Profile</label>
                <input
                  type="checkbox"
                  checked={settings.privacy.publicProfile}
                  onChange={(e) =>
                    handleSettingChange("privacy", "publicProfile", e.target.checked)
                  }
                  className="toggle-input"
                />
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-toggle">
                <label>Allow Note Sharing</label>
                <input
                  type="checkbox"
                  checked={settings.privacy.allowSharing}
                  onChange={(e) =>
                    handleSettingChange("privacy", "allowSharing", e.target.checked)
                  }
                  className="toggle-input"
                />
              </div>
            </div>
          </div>
        );

      case "admin":
        return (
          <div className="settings-section">
            <div className="section-header">
              <h2>Admin Panel</h2>
              <p>Administrative controls and management</p>
            </div>

            <Card className="admin-quick-access">
              <div className="admin-option">
                <Users className="w-6 h-6 text-blue-500" />
                <div className="admin-option-content">
                  <h3>Manage Administrators</h3>
                  <p>Add or remove admin privileges from users</p>
                </div>
                <Link href="/dashboard/settings/admin" className="admin-link-btn">
                  Go to Admin Panel →
                </Link>
              </div>
            </Card>

            <Card className="admin-quick-access">
              <div className="admin-option">
                <Shield className="w-6 h-6 text-green-500" />
                <div className="admin-option-content">
                  <h3>View System Reports</h3>
                  <p>Access detailed analytics and system statistics</p>
                </div>
                <Link href="/dashboard/report" className="admin-link-btn">
                  View Reports →
                </Link>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <Link href="/dashboard" className="back-button">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1>Settings</h1>
          <p>Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Sidebar Navigation */}
        <Card className="settings-sidebar">
          <div className="settings-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Settings Content */}
        <Card className="settings-content">
          {renderSection()}

          {/* Save Button */}
          <div className="settings-footer">
            <Button
              onClick={handleSave}
              className="btn-save"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              variant="secondary"
              className="btn-logout"
            >
              Log Out
            </Button>
            {saved && <span className="save-message">✓ Settings saved</span>}
          </div>
        </Card>
      </div>
    </div>
  );
}