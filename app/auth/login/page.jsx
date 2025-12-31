"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Captcha from "@/components/ui/Captcha";
import {
  Mail, Lock, AlertCircle, Loader2, Eye, EyeOff,
  LogIn, Github, Chrome, Shield, Sparkles
} from "lucide-react";
import Link from "next/link";
import "@/styles/auth.css";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const timedOut = sp.get("timeout") === "1";
  const registered = sp.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState({ captchaId: "", captchaAnswer: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Load saved email if exists
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      captchaId: captcha.captchaId,
      captchaAnswer: captcha.captchaAnswer
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email, password, or captcha. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleGuestLogin = () => {
    // Implement guest/demo login if needed
    setError("Guest login is currently disabled. Please use your account.");
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
        {/* Left Panel - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="logo-wrapper">
              <div className="logo-icon">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="logo-text">Web Notes</h1>
            </div>
            
            <div className="branding-features">
              <div className="feature-item">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Secure & Encrypted</span>
              </div>
              <div className="feature-item">
                <Chrome className="w-5 h-5 text-blue-500" />
                <span>Cross-platform Sync</span>
              </div>
              <div className="feature-item">
                <Github className="w-5 h-5 text-purple-500" />
                <span>Open Source</span>
              </div>
            </div>

            <div className="testimonial">
              <div className="quote-icon">"</div>
              <p className="quote-text">
                The best note-taking experience I've ever had. Simple, fast, and powerful.
              </p>
              <div className="quote-author">
                <div className="author-avatar">JS</div>
                <div className="author-info">
                  <div className="author-name">John Smith</div>
                  <div className="author-role">Product Designer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="auth-form-container">
          <div className="form-card">
            {/* Success Message */}
            {registered && (
              <div className="success-message">
                <div className="success-icon">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="success-title">Registration Successful!</h3>
                  <p className="success-text">
                    Your account has been created. Please sign in to continue.
                  </p>
                </div>
              </div>
            )}

            {/* Timeout Alert */}
            {timedOut && (
              <div className="alert-message warning">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <h3>Session Expired</h3>
                  <p>You were logged out due to inactivity. Please sign in again.</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert-message error">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <h3>Login Failed</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Form Header */}
            <div className="form-header">
              <h1 className="form-title">Welcome Back</h1>
              <p className="form-subtitle">
                Sign in to your account to continue to Web Notes
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="form-input"
                    required
                    disabled={loading}
                  />
                </div>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox"
                    disabled={loading}
                  />
                  <span className="checkbox-text">Remember me</span>
                </label>
                <Link
                  href="/auth/forget-password"
                  className="forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Captcha */}
              <div className="captcha-section">
                <Captcha onChange={setCaptcha} disabled={loading} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn primary"
                disabled={loading || !captcha.captchaId}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="divider">
                <span>Or continue with</span>
              </div>

              {/* Social Login */}
              <div className="social-buttons">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="social-btn google"
                  disabled={loading}
                >
                  <Chrome className="w-5 h-5" />
                  Google
                </button>
                
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="social-btn guest"
                  disabled={loading}
                >
                  <Sparkles className="w-5 h-5" />
                  Guest Access
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="signup-link">
                <span>Don't have an account?</span>
                <Link href="/auth/register" className="signup-text">
                  Create account
                </Link>
              </div>
            </form>

            {/* Terms */}
            <div className="terms">
              <p className="terms-text">
                By signing in, you agree to our{" "}
                <a href="/terms" className="terms-link">Terms of Service</a> and{" "}
                <a href="/privacy" className="terms-link">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}