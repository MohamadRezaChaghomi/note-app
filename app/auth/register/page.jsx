// app/auth/register/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  User, Mail, Lock, Eye, EyeOff, CheckCircle,
  AlertCircle, Loader2, Sparkles, Shield, ArrowRight
} from "lucide-react";
import Link from "next/link";
import GoogleReCaptcha from "@/components/ui/GoogleReCapcha";
import "@/styles/auth.css";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaError, setRecaptchaError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and numbers";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    return newErrors;
  };

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
    setFormData(prev => ({ ...prev, password: value }));
    setPasswordStrength(checkPasswordStrength(value));
  };

  const handleRecaptchaVerify = useCallback((token) => {
    setRecaptchaToken(token);
    setRecaptchaError("");
  }, []);

  const handleRecaptchaError = useCallback((errorMsg) => {
    setRecaptchaError(errorMsg);
    setRecaptchaToken("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!recaptchaToken) {
      setErrors({ submit: "Please complete the security verification" });
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name,
          email: formData.email,
          password: formData.password,
          recaptchaToken: recaptchaToken
        })
      });
      
      const data = await res.json();
      
      if (data.ok) {
        // Show success message
        setErrors({ 
          success: "Registration successful! Redirecting to login..."
        });
        
        setTimeout(() => {
          router.push("/auth/login?registered=1");
        }, 2000);
      } else {
        const msg = data.error === "EMAIL_EXISTS"
          ? "این ایمیل قبلا ثبت شده است. لطفاً از ایمیل دیگری استفاده کنید یا وارد شوید."
          : data.error === "RECAPTCHA_FAILED"
            ? "تأیید امنیتی ناموفق بود. لطفا دوباره تلاش کنید."
            : "ثبت‌نام ناموفق بود. لطفا دوباره تلاش کنید.";

        setErrors({ submit: msg });
        setRecaptchaToken("");
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please check your connection." });
      setRecaptchaToken("");
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

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
        <div className="bg-shape shape-3" />
        <div className="bg-shape shape-4" />
      </div>

      <div className="auth-content">
        {/* Left Panel - Form */}
        <div className="auth-form-container">
          <div className="form-card">
            {/* Back Button */}
            <div className="back-button">
              <Link href="/auth/login" className="back-link">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to login
              </Link>
            </div>

            <div className="form-header">
              <h1 className="form-title">Create Account</h1>
              <p className="form-subtitle">
                Join thousands of users who organize their thoughts with Web Notes
              </p>
            </div>

            {errors.success && (
              <div className="success-message">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <h3 className="success-title">Success!</h3>
                  <p className="success-text">{errors.success}</p>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="alert-message error">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <h3>Registration Failed</h3>
                  <p>{errors.submit}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                    }}
                    placeholder="John Doe"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.name && (
                  <div className="input-error">{errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                    }}
                    placeholder="you@example.com"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <div className="input-error">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      handlePasswordChange(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                    }}
                    placeholder="••••••••"
                    className={`form-input ${errors.password ? 'error' : ''}`}
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
                
                {formData.password && (
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
                  <div className={`requirement ${formData.password.length >= 8 ? 'met' : ''}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`requirement ${/[a-z]/.test(formData.password) ? 'met' : ''}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`requirement ${/[A-Z]/.test(formData.password) ? 'met' : ''}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`requirement ${/[0-9]/.test(formData.password) ? 'met' : ''}`}>
                    <CheckCircle className="w-3 h-3" />
                    <span>One number</span>
                  </div>
                </div>
                
                {errors.password && (
                  <div className="input-error">{errors.password}</div>
                )}
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
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
                    }}
                    placeholder="••••••••"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
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
                {errors.confirmPassword && (
                  <div className="input-error">{errors.confirmPassword}</div>
                )}
              </div>

              {/* Google reCAPTCHA v3 */}
              <GoogleReCaptcha 
                onVerify={handleRecaptchaVerify}
                onError={handleRecaptchaError}
                action="register"
                showScore={false}
                autoLoad={true}
              />

              {recaptchaError && (
                <div className="alert-message error">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">{recaptchaError}</p>
                </div>
              )}

              <div className="terms-agreement">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    required
                    className="checkbox"
                    disabled={loading}
                  />
                  <span className="checkbox-text">
                    I agree to the{" "}
                    <a href="/terms" className="terms-link">Terms of Service</a> and{" "}
                    <a href="/privacy" className="terms-link">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="submit-btn primary"
                disabled={loading || !recaptchaToken}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>

              <div className="signup-link">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="signup-text"
                >
                  Sign in
                </Link>
              </div>
            </form>

            <div className="security-info">
              <div className="security-item">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Your data is encrypted and secure</span>
              </div>
              <div className="security-item">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Free forever for personal use</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Benefits */}
        <div className="auth-branding">
          <div>
            <div className="logo-wrapper">
              <div className="logo-icon">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="logo-text">Web Notes</h1>
                <p className="text-blue-100 text-sm">Secure & Smart Note Taking</p>
              </div>
            </div>

            <div className="benefits">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <div className="icon-bg">✨</div>
                </div>
                <div className="benefit-content">
                  <h3>Unlimited Notes</h3>
                  <p>Create as many notes as you need, organized exactly how you want.</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">
                  <div className="icon-bg">🔒</div>
                </div>
                <div className="benefit-content">
                  <h3>Bank-level Security</h3>
                  <p>Your notes are encrypted and protected with industry-standard security.</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">
                  <div className="icon-bg">🌐</div>
                </div>
                <div className="benefit-content">
                  <h3>Access Anywhere</h3>
                  <p>Available on all your devices. Your notes sync automatically.</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">
                  <div className="icon-bg">🚀</div>
                </div>
                <div className="benefit-content">
                  <h3>Lightning Fast</h3>
                  <p>Built for speed. No lag, no waiting, just pure productivity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}