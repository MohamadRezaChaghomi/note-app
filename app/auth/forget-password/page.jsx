"use client";

import { useState } from "react";
import {
  Mail, ArrowLeft, CheckCircle, AlertCircle,
  Loader2, Shield, Send
} from "lucide-react";
import Link from "next/link";
import "@/styles/auth.css";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setDone(true);
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background Decoration */}
      <div className="auth-background">
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
        <div className="bg-shape shape-3" />
        <div className="bg-shape shape-4" />
      </div>

      <div className="auth-content compact">
        <div className="auth-form-container">
          <div className="form-card">
            {/* Back Button */}
            <div className="back-button">
              <Link href="/auth/login" className="back-link">
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>

            {/* Success State */}
            {done ? (
              <div className="success-state">
                <div className="success-icon-large">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h1 className="success-title">Check Your Email</h1>
                <p className="success-message">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                
                <div className="success-tips">
                  <div className="tip">
                    <Shield className="w-4 h-4" />
                    <span>For security, the link expires in 1 hour</span>
                  </div>
                  <div className="tip">
                    <AlertCircle className="w-4 h-4" />
                    <span>Can't find the email? Check your spam folder</span>
                  </div>
                </div>
                
                <div className="success-actions">
                  <button
                    onClick={() => {
                      setDone(false);
                      setEmail("");
                    }}
                    className="secondary-btn"
                  >
                    Send another email
                  </button>
                  <Link href="/auth/login" className="primary-btn">
                    Return to login
                  </Link>
                </div>
              </div>
            ) : (
              /* Form State */
              <>
                {/* Header */}
                <div className="form-header">
                  <h1 className="form-title">Reset Password</h1>
                  <p className="form-subtitle">
                    Enter your email address and we'll send you a link to reset your password
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert-message error">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                      <h3>Error</h3>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label className="form-label">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="you@example.com"
                        className="form-input"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="submit-btn primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>

                {/* Security Note */}
                <div className="security-note">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <p>
                    For security reasons, we don't store your password. 
                    The reset link will expire in 1 hour.
                  </p>
                </div>

                {/* Need Help */}
                <div className="help-section">
                  <p className="help-text">
                    Need help?{" "}
                    <a href="/support" className="help-link">
                      Contact support
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}