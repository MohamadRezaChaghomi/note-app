"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users, Lock, Trash2, Plus, Loader2, AlertCircle,
  CheckCircle, XCircle, Shield
} from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import "@/styles/settings.css";

export default function AdminManagementPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.role === "admin") {
      setIsAdmin(true);
    } else if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  // Load admins
  useEffect(() => {
    if (!isAdmin) return;

    async function loadAdmins() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/auth/admins");

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to load admins");
        }

        const data = await res.json();
        setAdmins(data.admins || []);
      } catch (err) {
        console.error("Load admins error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAdmins();
  }, [isAdmin]);

  const handleAddAdmin = useCallback(async () => {
    if (!newAdminEmail.trim()) {
      setMessage({ ok: false, text: "Please enter an email address" });
      return;
    }

    try {
      setIsAddingAdmin(true);
      setMessage(null);

      const res = await fetch("/api/auth/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newAdminEmail.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add admin");
      }

      setMessage({ ok: true, text: data.message });
      setNewAdminEmail("");

      // Reload admins
      const getRes = await fetch("/api/auth/admins");
      if (getRes.ok) {
        const newData = await getRes.json();
        setAdmins(newData.admins || []);
      }
    } catch (err) {
      console.error("Add admin error:", err);
      setMessage({ ok: false, text: err.message });
    } finally {
      setIsAddingAdmin(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }, [newAdminEmail]);

  const handleRemoveAdmin = useCallback(
    async (userId, userName) => {
      if (!window.confirm(`Remove ${userName} as admin? This cannot be undone.`)) {
        return;
      }

      try {
        setMessage(null);
        const res = await fetch(`/api/auth/admins?id=${userId}`, {
          method: "DELETE"
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to remove admin");
        }

        setMessage({ ok: true, text: data.message });

        // Reload admins
        const getRes = await fetch("/api/auth/admins");
        if (getRes.ok) {
          const newData = await getRes.json();
          setAdmins(newData.admins || []);
        }
      } catch (err) {
        console.error("Remove admin error:", err);
        setMessage({ ok: false, text: err.message });
      }
      setTimeout(() => setMessage(null), 4000);
    },
    []
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (!isAdmin) {
    return (
      <div className="settings-page">
        <div className="settings-header">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <h1>Access Denied</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <Link href="/dashboard" className="back-button">
          ← Back
        </Link>
        <div>
          <h1 className="admin-title">
            <Shield className="w-6 h-6 inline-block mr-2" />
            Admin Management
          </h1>
          <p>Manage administrator accounts and permissions</p>
        </div>
      </div>

      <div className="admin-container">
        {/* Add New Admin Card */}
        <Card className="admin-card add-admin-card">
          <div className="card-header">
            <h2 className="card-title">
              <Plus className="w-5 h-5" />
              Add New Admin
            </h2>
            <p className="card-description">Promote a user to administrator</p>
          </div>

          <div className="add-admin-form">
            <div className="form-group">
              <label htmlFor="adminEmail">User Email Address</label>
              <div className="input-group">
                <input
                  type="email"
                  id="adminEmail"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddAdmin()}
                  placeholder="user@example.com"
                  className="admin-input"
                  disabled={isAddingAdmin}
                />
                <Button
                  onClick={handleAddAdmin}
                  disabled={isAddingAdmin || !newAdminEmail.trim()}
                  className="btn-add-admin"
                >
                  {isAddingAdmin ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Promote to Admin
                </Button>
              </div>
            </div>
          </div>

          {message && (
            <div className={`message-banner ${message.ok ? "success" : "error"}`}>
              {message.ok ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </Card>

        {/* Admins List Card */}
        <Card className="admin-card admins-list-card">
          <div className="card-header">
            <h2 className="card-title">
              <Users className="w-5 h-5" />
              Current Administrators
            </h2>
            <p className="card-description">
              {admins.length} {admins.length === 1 ? "admin" : "admins"} in the system
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p>Loading administrators...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle className="w-6 h-6" />
              <p>{error}</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="empty-state">
              <Users className="w-8 h-8" />
              <p>No administrators found</p>
            </div>
          ) : (
            <div className="admins-table">
              <div className="table-header">
                <div className="col-name">Name</div>
                <div className="col-email">Email</div>
                <div className="col-joined">Joined</div>
                <div className="col-last-login">Last Login</div>
                <div className="col-action">Action</div>
              </div>

              <div className="table-body">
                {admins.map((admin) => (
                  <div key={admin._id} className="table-row">
                    <div className="col-name">
                      <div className="admin-info">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="admin-name">{admin.name}</span>
                      </div>
                    </div>
                    <div className="col-email">{admin.email}</div>
                    <div className="col-joined">{formatDate(admin.createdAt)}</div>
                    <div className="col-last-login">
                      {admin.lastLogin
                        ? formatDate(admin.lastLogin)
                        : "Never"}
                    </div>
                    <div className="col-action">
                      {admin._id === session?.user?.id ? (
                        <span className="self-badge">You</span>
                      ) : (
                        <button
                          onClick={() => handleRemoveAdmin(admin._id, admin.name)}
                          className="btn-remove-admin"
                          title="Remove admin privileges"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Admin Privileges Info */}
        <Card className="admin-card info-card">
          <div className="card-header">
            <h2 className="card-title">
              <Lock className="w-5 h-5" />
              Admin Privileges
            </h2>
          </div>

          <div className="privileges-list">
            <div className="privilege-item">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <strong>View System Reports</strong>
                <p>Access detailed analytics and system statistics</p>
              </div>
            </div>
            <div className="privilege-item">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <strong>Manage Administrators</strong>
                <p>Promote or demote other users to admin role</p>
              </div>
            </div>
            <div className="privilege-item">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <strong>Export Data</strong>
                <p>Export system reports in PDF format</p>
              </div>
            </div>
            <div className="privilege-item">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <strong>System Monitoring</strong>
                <p>Monitor user activity and system health</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
