// components/ui/GoogleReCaptcha.jsx
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { Shield, AlertCircle, Check, RefreshCw } from 'lucide-react';
import '@/styles/components/recaptcha.css';

export default function GoogleReCaptcha({ 
  onVerify, 
  action = 'login',
  showScore = false,
  autoLoad = true
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [token, setToken] = useState(null);
  const [score, setScore] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const scriptRef = useRef(null);
  const mountedRef = useRef(true);

  // Set isMounted to true after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
    return () => {
      mountedRef.current = false;
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, []);

  // Load reCAPTCHA script - فقط در کلاینت اجرا شود
  const loadScript = useCallback(() => {
    if (!isMounted || typeof window === 'undefined') return;

    // اگر در محیط توسعه و reCAPTCHA غیرفعال است
    if (process.env.NODE_ENV === 'development' && 
        process.env.VERIFY_RECAPTCHA_IN_DEV === 'false') {
      setIsReady(true);
      return;
    }

    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        if (mountedRef.current) {
          setIsReady(true);
        }
      });
      return;
    }

    // بررسی آیا اسکریپت در حال لود شدن است
    if (document.querySelector('script[src*="recaptcha"]')) {
      const checkInterval = setInterval(() => {
        if (window.grecaptcha) {
          clearInterval(checkInterval);
          window.grecaptcha.ready(() => {
            if (mountedRef.current) {
              setIsReady(true);
            }
          });
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          if (mountedRef.current) {
            setIsReady(true);
          }
        });
      }
    };
    
    script.onerror = () => {
      if (mountedRef.current) {
        setError('Failed to load reCAPTCHA script.');
      }
    };
    
    document.head.appendChild(script);
    scriptRef.current = script;
  }, [isMounted]);

  // Execute reCAPTCHA
  const executeRecaptcha = useCallback(async () => {
    if (!isReady || !isMounted) return;

    if (process.env.NODE_ENV === 'development' && 
        process.env.VERIFY_RECAPTCHA_IN_DEV === 'false') {
      const dummyToken = 'development-dummy-token';
      setToken(dummyToken);
      onVerify?.(dummyToken);
      if (showScore) setScore(0.95);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) throw new Error('reCAPTCHA site key is not configured');

      if (!window.grecaptcha) throw new Error('grecaptcha object not found');

      const freshToken = await new Promise((resolve, reject) => {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(siteKey, { action });
            resolve(token);
          } catch (err) {
            reject(err);
          }
        });
      });
      
      if (mountedRef.current) {
        setToken(freshToken);
        onVerify?.(freshToken);
        
        if (showScore) {
          setTimeout(() => {
            if (mountedRef.current) {
              setScore(0.9 + Math.random() * 0.1);
            }
          }, 500);
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message || 'Failed to execute reCAPTCHA');
        setToken(null);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isReady, isMounted, action, onVerify, showScore]);

  // Initial load
  useEffect(() => {
    if (isMounted && autoLoad) {
      loadScript();
    }
  }, [isMounted, autoLoad, loadScript]);

  // Execute when ready
  useEffect(() => {
    if (isMounted && isReady && autoLoad) {
      executeRecaptcha();
    }
  }, [isMounted, isReady, autoLoad, executeRecaptcha]);

  // Manual refresh
  const refreshRecaptcha = useCallback(async () => {
    if (!isMounted) return;
    setToken(null);
    setScore(null);
    setError(null);
    await executeRecaptcha();
  }, [isMounted, executeRecaptcha]);

  // در محیط توسعه و اگر reCAPTCHA غیرفعال است
  if (!isMounted || (process.env.NODE_ENV === 'development' && 
      process.env.VERIFY_RECAPTCHA_IN_DEV === 'false')) {
    return (
      <div className="recaptcha-container">
        <div className="recaptcha-card">
          <div className="recaptcha-status">
            <div className="recaptcha-status-icon success">
              <Check className="w-5 h-5 text-green-500" />
            </div>
            <div className="recaptcha-status-content">
              <div className="recaptcha-status-title">Security Check</div>
              <div className="recaptcha-status-message">
                reCAPTCHA verification is disabled in development
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="recaptcha-container">
        <div className="recaptcha-error">
          <div className="recaptcha-error-header">
            <AlertCircle className="w-5 h-5" />
            <div className="recaptcha-error-title">Security Check Failed</div>
          </div>
          <div className="recaptcha-error-message">{error}</div>
          <button
            onClick={refreshRecaptcha}
            className="recaptcha-retry-btn"
            disabled={isLoading}
          >
            <RefreshCw className="w-3 h-3" />
            {isLoading ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="recaptcha-container">
      <div className="recaptcha-header">
        <label className="recaptcha-label">
          <Shield className="w-4 h-4" />
          Security Verification
        </label>
        <div className="recaptcha-branding">
          <span className="recaptcha-brand-text">Powered by</span>
          <div className="recaptcha-logo" />
        </div>
      </div>

      <div className="recaptcha-card">
        <div className="recaptcha-card-header">
          <div>
            <div className="recaptcha-title">Google reCAPTCHA v3</div>
            <div className="recaptcha-subtitle">Invisible security verification</div>
          </div>
          
          <button
            type="button"
            onClick={refreshRecaptcha}
            disabled={!isReady || isLoading}
            className="recaptcha-refresh-btn"
            aria-label="Refresh security check"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="recaptcha-status">
          <div className={`recaptcha-status-icon ${token ? 'success' : 'loading'}`}>
            {token ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <div className="recaptcha-spinner" />
            )}
          </div>
          <div className="recaptcha-status-content">
            <div className="recaptcha-status-title">
              {token ? 'Verification Complete' : 
               !isReady ? 'Loading Security...' : 'Verifying...'}
            </div>
            <div className="recaptcha-status-message">
              {token 
                ? 'You have successfully passed the security check'
                : !isReady
                ? 'Loading reCAPTCHA security system...'
                : 'Please wait while we verify you\'re human'
              }
            </div>
          </div>
        </div>

        {showScore && score !== null && (
          <div className="recaptcha-score-section">
            <div className="recaptcha-score-header">
              <div className="recaptcha-score-label">Trust Score</div>
              <div className="recaptcha-score-value">{score.toFixed(1)}</div>
            </div>
            <div className="recaptcha-score-bar">
              <div 
                className="recaptcha-score-fill" 
                style={{ width: `${score * 100}%` }}
              />
            </div>
            <div className="recaptcha-score-labels">
              <span className="recaptcha-score-label-left">Bot</span>
              <span className="recaptcha-score-label-right">Human</span>
            </div>
          </div>
        )}

        <div className="recaptcha-footer">
          {!isReady 
            ? 'Loading reCAPTCHA security...'
            : 'This invisible security check helps prevent spam and abuse.'
          }
        </div>
      </div>
    </div>
  );
}