"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Lock, Eye, EyeOff, CheckCircle, AlertCircle,
  Loader2, Shield, ArrowRight
} from "lucide-react";
import "@/styles/auth.css";

export default function ResetPasswordPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const email = sp.get("email") || "";
  const token = sp.get("token") || "";

  const [valid, setValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function check() {
      if (email && token) {
        try {
          const res = await fetch(
            `/api/auth/validate-reset-token?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
          );
          const data = await res.json();
          setValid(!!data.ok);
        } catch {
          setValid(false);
        }
      } else {
        setValid(false);
      }
      setVerifying(false);
    }
    check();
  }, [email, token]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (value) => {
    setFormData(prev => ({ ...prev, newPassword: value }));
    setPasswordStrength(checkPasswordStrength(value));
    if (message.type) setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    if (!formData.newPassword) {
      return "Please enter a new password";
    }
    
    if (formData.newPassword.length < 8) {
      return "Password must be at least 8 characters";
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      return "Password must contain uppercase, lowercase, and numbers";
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      setMessage({ type: "error", text: error });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          token, 
          newPassword: formData.newPassword 
        })
      });
      
      const data = await res.json();
      
      if (data.ok) {
        setMessage({ 
          type: "success", 
          text: "Password changed successfully! Redirecting to login..." 
        });
        
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setMessage({ 
          type: "error", 
          text: data.error || "Invalid or expired reset link. Please request a new one." 
        });
      }
    } catch {
      setMessage({ 
        type: "error", 
        text: "Network error. Please check your connection." 
      });
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (strength) => {
    if (strength <= 2) return "#ef4444";
    if (strength === 3) return "#f59e0b";
    return "#10b981";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  if (verifying) {
    return (
      <div className="auth-container">
        <div className="auth-content compact">
          <div className="loading-state">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p>Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="auth-container">
        <div className="auth-content compact">
          <div className="error-state">
            <div className="error-icon">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="error-title">Invalid Reset Link</h1>
            <p className="error-message">
              This password reset link is invalid or has expired.
              Please request a new reset link from the login page.
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="primary-btn"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
        <div className="bg-shape shape-3" />
        <div className="bg-shape shape-4" />
      </div>

      <div className="auth-content compact">
        <div className="auth-form-container">
          <div className="form-card">
            {message.type === "success" && (
              <div className="success-state">
                <div className="success-icon-large">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="success-title">Success!</h1>
                <p className="success-message">{message.text}</p>
              </div>
            )}

            {message.type === "error" && (
              <div className="alert-message error">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <h3>Error</h3>
                  <p>{message.text}</p>
                </div>
              </div>
            )}

            {message.type !== "success" && (
              <>
                <div className="form-header">
                  <h1 className="form-title">New Password</h1>
                  <p className="form-subtitle">
                    Create a new password for your account
                  </p>
                  <div className="account-info">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Account: {email}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label className="form-label">
                      <Lock className="w-4 h-4" />
                      New Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        placeholder="••••••••"
                        className="form-input"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    
                    {formData.newPassword && (
                      <div className="password-strength">
                        <div className="strength-bars">
                          {[1, 2, 3, 4, 5].map((index) => (
                            <div
                              key={index}
                              className={`strength-bar ${index <= passwordStrength ? 'active' : ''}`}
                              style={{
                                backgroundColor: index <= passwordStrength 
                                  ? getStrengthColor(passwordStrength) 
                                  : '#e2e8f0'
                              }}
                            />
                          ))}
                        </div>
                        <div className="strength-text">
                          Strength: <span style={{ color: getStrengthColor(passwordStrength) }}>
                            {getStrengthText(passwordStrength)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="password-requirements">
                      <div className={`requirement ${formData.newPassword.length >= 8 ? 'met' : ''}`}>
                        <CheckCircle className="w-3 h-3" />
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`requirement ${/[a-z]/.test(formData.newPassword) ? 'met' : ''}`}>
                        <CheckCircle className="w-3 h-3" />
                        <span>One lowercase letter</span>
                      </div>
                      <div className={`requirement ${/[A-Z]/.test(formData.newPassword) ? 'met' : ''}`}>
                        <CheckCircle className="w-3 h-3" />
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`requirement ${/[0-9]/.test(formData.newPassword) ? 'met' : ''}`}>
                        <CheckCircle className="w-3 h-3" />
                        <span>One number</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Lock className="w-4 h-4" />
                      Confirm Password
                    </label>
                    <div className="input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          confirmPassword: e.target.value 
                        }))}
                        placeholder="••••••••"
                        className="form-input"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="password-toggle"
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        Change Password
                      </>
                    )}
                  </button>
                </form>

                <div className="security-tips">
                  <div className="tip">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Use a strong, unique password you haven't used elsewhere</span>
                  </div>
                  <div className="tip">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <span>After changing, you'll be redirected to login</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}