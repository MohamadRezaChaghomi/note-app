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
  const [token, setToken] = useState(null);
  const [score, setScore] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const scriptRef = useRef(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, []);

  // Load reCAPTCHA script
  const loadScript = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="recaptcha"]')) {
      const checkInterval = setInterval(() => {
        if (window.grecaptcha) {
          clearInterval(checkInterval);
          setIsLoaded(true);
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (mountedRef.current) {
        setIsLoaded(true);
      }
    };
    
    script.onerror = () => {
      if (mountedRef.current) {
        setError('Failed to load reCAPTCHA script. Please check your connection.');
      }
    };
    
    document.head.appendChild(script);
    scriptRef.current = script;
  }, []);

  // Execute reCAPTCHA
  const executeRecaptcha = useCallback(async () => {
    if (!isLoaded || !window.grecaptcha) {
      setError('reCAPTCHA is not ready');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        throw new Error('reCAPTCHA site key is not configured');
      }

      const freshToken = await window.grecaptcha.execute(siteKey, { action });
      
      if (mountedRef.current) {
        setToken(freshToken);
        onVerify?.(freshToken);
        
        // Simulate score for demo (remove in production)
        if (showScore) {
          setTimeout(() => {
            if (mountedRef.current) {
              setScore(0.9 + Math.random() * 0.1); // Random score between 0.9-1.0
            }
          }, 500);
        }
      }
    } catch (err) {
      if (mountedRef.current) {
        console.error('reCAPTCHA execution error:', err);
        setError(err.message || 'Failed to execute reCAPTCHA');
        setToken(null);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isLoaded, action, onVerify, showScore]);

  // Initial load and execute
  useEffect(() => {
    if (autoLoad) {
      loadScript();
    }
  }, [autoLoad, loadScript]);

  // Execute when script loads
  useEffect(() => {
    if (isLoaded && autoLoad) {
      executeRecaptcha();
    }
  }, [isLoaded, autoLoad, executeRecaptcha]);

  // Manual refresh
  const refreshRecaptcha = useCallback(async () => {
    setToken(null);
    setScore(null);
    setError(null);
    await executeRecaptcha();
  }, [executeRecaptcha]);

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
          >
            <RefreshCw className="w-3 h-3" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            disabled={!isLoaded || isLoading}
            className="recaptcha-refresh-btn"
            aria-label="Refresh security check"
          >
            <RefreshCw className="w-4 h-4" />
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
              {token ? 'Verification Complete' : 'Verifying Security'}
            </div>
            <div className="recaptcha-status-message">
              {token 
                ? 'You have successfully passed the security check'
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
          This invisible security check helps prevent spam and abuse. 
          No interaction required.
        </div>
      </div>
    </div>
  );
}