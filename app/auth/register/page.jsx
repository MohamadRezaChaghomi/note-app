"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  User, Mail, Lock, Eye, EyeOff, CheckCircle,
  AlertCircle, Loader2, Sparkles, Shield, ArrowRight
} from "lucide-react";
import Link from "next/link";
import "@/styles/auth.css";

// reCAPTCHA utility
const executeRecaptcha = async (action = 'register') => {
  if (typeof window === 'undefined' || !window.grecaptcha) {
    console.error('reCAPTCHA not loaded');
    return null;
  }

  try {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      console.warn('reCAPTCHA site key not configured');
      return 'development_token';
    }

    const token = await window.grecaptcha.execute(siteKey, { action });
    return token;
  } catch (error) {
    console.error('reCAPTCHA execution failed:', error);
    return null;
  }
};

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Get reCAPTCHA token
    const recaptchaToken = await executeRecaptcha('register');
    if (!recaptchaToken) {
      setErrors({ submit: "Security verification failed. Please refresh the page." });
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
          recaptchaToken
        })
      });
      
      const data = await res.json();
      
      if (data.ok) {
        setTimeout(() => {
          router.push("/auth/login?registered=1");
        }, 1500);
      } else {
        setErrors({ 
          submit: data.error === "EMAIL_EXISTS" 
            ? "This email is already registered. Please use a different email or login." 
            : data.error === "RECAPTCHA_FAILED"
            ? "Security verification failed. Please try again."
            : "Registration failed. Please try again." 
        });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please check your connection." });
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
      {/* Background Decoration */}
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
            {/* Form Header */}
            <div className="form-header">
              <h1 className="form-title">Create Account</h1>
              <p className="form-subtitle">
                Join thousands of users who organize their thoughts with Web Notes
              </p>
            </div>

            {/* Error Messages */}
            {errors.submit && (
              <div className="alert-message error">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <h3>Registration Failed</h3>
                  <p>{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="login-form">
              {/* Name Field */}
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

              {/* Email Field */}
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

              {/* Password Field */}
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
                
                {/* Password Strength Meter */}
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
                
                {/* Password Requirements */}
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

              {/* Confirm Password Field */}
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

              {/* reCAPTCHA */}
              <div className="captcha-section">
                <GoogleReCaptcha 
                  ref={recaptchaRef}
                  onVerify={handleRecaptchaVerify} 
                  action="register" 
                />
                {recaptchaError && (
                  <div className="input-error">Please complete the security check</div>
                )}
              </div>

              {/* Terms Agreement */}
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

              {/* Submit Button */}
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

              {/* Login Link */}
              <div className="login-link">
                <span>Already have an account?</span>
                <Link href="/auth/login" className="login-text">
                  Sign in
                </Link>
              </div>
            </form>

            {/* Security Info */}
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
          <div className="branding-content">
            <div className="logo-wrapper">
              <div className="logo-icon">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="logo-text">Web Notes</h1>
            </div>
            
            <div className="benefits">
              <h2 className="benefits-title">Why Join Web Notes?</h2>
              
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

            <div className="stats">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Notes Created</div>
              </div>
              <div className="stat">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}