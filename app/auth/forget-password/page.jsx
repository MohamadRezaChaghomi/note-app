"use client";

import { useState } from "react";
import { 
  Mail, ArrowLeft, CheckCircle, AlertCircle,
  Loader2, Shield, Send, Lock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/styles/auth.css";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code, 3: Success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendCode = async (e) => {
    e?.preventDefault();
    
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
      
      const data = await res.json();
      
      if (data.ok) {
        setStep(2); // به مرحله وارد کردن کد برو
        setSuccessMessage("A 6-digit code has been sent to your email.");
      } else {
        setError(data.error || "Failed to send code. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e?.preventDefault();
    
    if (!code.trim() || code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });
      
      const data = await res.json();
      
      if (data.ok) {
        // هدایت به صفحه reset-password با email و code
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&code=${code}`);
      } else {
        if (data.error === "CODE_EXPIRED") {
          setError("The code has expired. Please request a new one.");
          setStep(1); // بازگشت به مرحله اول
        } else {
          setError(data.error === "INVALID_CODE" 
            ? "Invalid code. Please check and try again." 
            : "Verification failed. Please try again.");
        }
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setCode("");
    setError("");
    handleSendCode();
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

            {/* Step 1: Enter Email */}
            {step === 1 && (
              <>
                {/* Header */}
                <div className="form-header">
                  <h1 className="form-title">Reset Password</h1>
                  <p className="form-subtitle">
                    Enter your email address to receive a 6-digit verification code
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
                <form onSubmit={handleSendCode} className="login-form">
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
                        Send Verification Code
                      </>
                    )}
                  </button>
                </form>

                {/* Security Note */}
                <div className="security-note">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <p>
                    A 6-digit code will be sent to your email. 
                    The code expires in 10 minutes.
                  </p>
                </div>
              </>
            )}

            {/* Step 2: Enter Code */}
            {step === 2 && (
              <>
                {/* Header */}
                <div className="form-header">
                  <h1 className="form-title">Enter Verification Code</h1>
                  <p className="form-subtitle">
                    Enter the 6-digit code sent to <strong>{email}</strong>
                  </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="alert-message success">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                      <h3>Code Sent</h3>
                      <p>{successMessage}</p>
                    </div>
                  </div>
                )}

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
                <form onSubmit={handleVerifyCode} className="login-form">
                  <div className="form-group">
                    <label className="form-label">
                      <Lock className="w-4 h-4" />
                      6-Digit Code
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setCode(value);
                          if (error) setError("");
                        }}
                        placeholder="123456"
                        className="form-input text-center tracking-widest text-2xl"
                        required
                        disabled={loading}
                        maxLength={6}
                        inputMode="numeric"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Enter the 6-digit code from your email
                    </p>
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
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Verify Code
                      </>
                    )}
                  </button>

                  {/* Resend Code */}
                  <div className="resend-section">
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-blue-500 hover:text-blue-700 font-medium"
                        disabled={loading}
                      >
                        Resend Code
                      </button>
                    </p>
                  </div>
                </form>

                {/* Change Email */}
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setCode("");
                      setError("");
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Use a different email address
                  </button>
                </div>
              </>
            )}

            {/* Need Help */}
            <div className="help-section">
              <p className="help-text">
                Need help?{" "}
                <a href="/support" className="help-link">
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
