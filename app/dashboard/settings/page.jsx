"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Settings, Bell, Shield, Palette, User, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
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

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      // In real app, save to API
      // await fetch("/api/settings", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(settings)
      // });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
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
        <div className="settings-sidebar">
          <div className="settings-nav">
            <button className="nav-item active" data-section="general">
              <User className="w-4 h-4" />
              General
            </button>
            <button className="nav-item" data-section="notifications">
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button className="nav-item" data-section="appearance">
              <Palette className="w-4 h-4" />
              Appearance
            </button>
            <button className="nav-item" data-section="privacy">
              <Shield className="w-4 h-4" />
              Privacy
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* General Settings */}
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
              <input
                type="text"
                id="name"
                value={session?.user?.name || ""}
                disabled
                className="setting-input"
              />
            </div>
          </div>

          {/* Notification Settings */}
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

          {/* Appearance Settings */}
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

          {/* Privacy Settings */}
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

          {/* Save Button */}
          <div className="settings-footer">
            <button onClick={handleSave} className="btn-save">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-logout">
             Log Out
            </button>
            {saved && <span className="save-message">✓ Settings saved</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
