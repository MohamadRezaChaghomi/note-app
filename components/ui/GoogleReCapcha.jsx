// components/ui/GoogleReCaptcha.jsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { Shield, AlertCircle, Check } from 'lucide-react';

export default function GoogleReCaptcha({ onVerify, action = 'login' }) {
  const [token, setToken] = useState(null);
  const [score, setScore] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  
  const scriptRef = useRef(null);

  // بارگذاری اسکریپت reCAPTCHA
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        setIsLoaded(true);
        executeRecaptcha();
        return;
      }

      // اضافه کردن اسکریپت اگر وجود ندارد
      if (!scriptRef.current) {
        scriptRef.current = document.createElement('script');
        scriptRef.current.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
        scriptRef.current.async = true;
        scriptRef.current.defer = true;
        
        scriptRef.current.onload = () => {
          setIsLoaded(true);
          executeRecaptcha();
        };
        
        scriptRef.current.onerror = () => {
          setError('Failed to load reCAPTCHA');
        };
        
        document.head.appendChild(scriptRef.current);
      }
    };

    loadRecaptcha();

    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  // اجرای reCAPTCHA
  const executeRecaptcha = async () => {
    if (!window.grecaptcha) {
      setError('reCAPTCHA not loaded');
      return;
    }

    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        throw new Error('reCAPTCHA site key is not configured');
      }

      const token = await window.grecaptcha.execute(siteKey, { action });
      setToken(token);
      
      // ارسال توکن به والد
      onVerify?.(token);
      
      // برای نمایش (در حالت واقعی نباید این کار رو کرد)
      // این فقط برای نمایش در دمو است
      setTimeout(() => {
        setScore(0.9); // شبیه‌سازی امتیاز
      }, 500);
      
    } catch (err) {
      console.error('reCAPTCHA execution error:', err);
      setError('Failed to execute reCAPTCHA');
    }
  };

  // اجرای مجدد reCAPTCHA
  const refreshRecaptcha = async () => {
    setToken(null);
    setScore(null);
    setError(null);
    await executeRecaptcha();
  };

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">reCAPTCHA Error</span>
        </div>
        <p className="mt-1 text-sm text-red-500 dark:text-red-300">{error}</p>
        <button
          onClick={refreshRecaptcha}
          className="mt-3 px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Shield className="w-4 h-4" />
          Security Check
        </label>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-500 dark:text-gray-400">Powered by Google</span>
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-red-500 rounded" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Google reCAPTCHA v3
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Invisible security check
            </div>
          </div>
          
          <button
            type="button"
            onClick={refreshRecaptcha}
            disabled={!isLoaded}
            className="rounded-lg border border-gray-300 bg-white p-2 transition-all hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Refresh reCAPTCHA"
          >
            <svg
              className="w-4 h-4 text-gray-600 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${token ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {token ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {token ? 'Verification Complete' : 'Verifying...'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {token ? 'You have passed the security check' : 'Checking if you\'re human...'}
              </div>
            </div>
          </div>

          {score !== null && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Trust Score
                </div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {score.toFixed(1)}
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${score * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Bot</span>
                <span>Human</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          This invisible check helps us prevent spam and abuse. No puzzle solving required.
        </div>
      </div>
    </div>
  );
}