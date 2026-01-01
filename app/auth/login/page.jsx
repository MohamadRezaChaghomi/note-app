"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, LogIn, 
  Chrome, Shield, Sparkles, ArrowLeft, CheckCircle 
} from "lucide-react";
import Link from "next/link";
import "@/styles/auth.css";

// reCAPTCHA utility
const executeRecaptcha = async (action = 'login') => {
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

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const timedOut = sp.get("timeout") === "1";
  const registered = sp.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  // Check reCAPTCHA loaded
  useEffect(() => {
    const checkRecaptcha = () => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        setRecaptchaLoaded(true);
      }
    };

    // Check immediately
    checkRecaptcha();
    
    // Also check after a delay
    const timer = setTimeout(checkRecaptcha, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Load saved email
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Execute reCAPTCHA on mount and when error occurs
  useEffect(() => {
    if (recaptchaLoaded && !recaptchaToken) {
      getRecaptchaToken();
    }
  }, [recaptchaLoaded, recaptchaToken]);

  const getRecaptchaToken = async () => {
    const token = await executeRecaptcha('login');
    if (token) {
      setRecaptchaToken(token);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate form
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Get fresh reCAPTCHA token
    const freshToken = await executeRecaptcha('login');
    if (!freshToken) {
      setError("Security check failed. Please refresh the page.");
      return;
    }

    setLoading(true);

    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        recaptchaToken: freshToken,
      });

      console.log("Login response:", res);

      if (!res?.error) {
        // Login successful
        router.push("/dashboard");
        router.refresh();
      } else {
        // Login failed
        let errorMsg = "Invalid email, password, or security check.";
        
        if (res.error === "CredentialsSignin") {
          errorMsg = "Invalid email or password.";
        } else if (res.error?.includes("recaptcha")) {
          errorMsg = "Security verification failed. Please try again.";
        }
        
        setError(errorMsg);
        // Refresh reCAPTCHA on failed attempt
        setRecaptchaToken("");
        getRecaptchaToken();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error("Google signin error:", err);
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background Animation */}
      <div className="auth-background">
        <div className="bg-shape shape-1" />
        <div className="bg-shape shape-2" />
        <div className="bg-shape shape-3" />
        <div className="bg-shape shape-4" />
      </div>

      <div className="auth-content">
        {/* Left Panel - Branding */}
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
                  <div className="icon-bg">
                    <Shield className="w-5 h-5" />
                  </div>
                </div>
                <div className="benefit-content">
                  <h3>Advanced Security</h3>
                  <p>End-to-end encryption for your notes</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <div className="icon-bg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="benefit-content">
                  <h3>Real-time Sync</h3>
                  <p>Access your notes across all devices</p>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="quote-icon">"</div>
            <p className="quote-text">
              "The best online note-taking experience I've ever had! Completely changed how I organize my thoughts."
            </p>
            <div className="quote-author">
              <div className="author-avatar">SJ</div>
              <div className="author-info">
                <div className="author-name">Sarah Johnson</div>
                <div className="author-role">UX Designer at TechCorp</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="auth-form-container">
          <div className="form-card">
            {/* Back Button */}
            <div className="back-button">
              <Link href="/" className="back-link">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>

            <div className="form-header">
              <h1 className="form-title">Welcome Back!</h1>
              <p className="form-subtitle">Sign in to your account to continue</p>
            </div>

            {/* Success/Error Messages */}
            {registered && (
              <div className="success-message">
                <div className="success-icon">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="success-title">Registration Successful!</h3>
                  <p className="success-text">
                    Your account has been created. Please sign in.
                  </p>
                </div>
              </div>
            )}

            {timedOut && (
              <div className="alert-message warning">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <h3>Session Expired</h3>
                  <p>You were logged out due to inactivity. Please sign in again.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="alert-message error">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <h3>Login Failed</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}

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
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
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

              {/* reCAPTCHA Status */}
              <div className="security-info">
                <div className="security-item">
                  <Shield className="w-4 h-4" />
                  <span>
                    {recaptchaToken ? "✓ Security check passed" : "⏳ Verifying security..."}
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Google reCAPTCHA v3 is protecting this form from spam
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !recaptchaToken}
                className="submit-btn primary"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="divider">
                <span>Or continue with</span>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="social-btn google"
              >
                <Chrome className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>

              {/* Sign Up Link */}
              <div className="signup-link">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="signup-text"
                >
                  Sign up
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