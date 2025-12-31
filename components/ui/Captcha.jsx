"use client";
import { useEffect, useState } from "react";
import { RefreshCw, AlertCircle, Check } from "lucide-react";

export default function Captcha({ onChange, hasError = false }) {
  const [captcha, setCaptcha] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function refresh() {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/auth/captcha");
      const data = await res.json();
      setCaptcha({ captchaId: data.captchaId, question: data.question });
      setAnswer("");
      onChange?.({ captchaId: data.captchaId, captchaAnswer: "" });
    } catch (error) {
      console.error("Failed to refresh captcha:", error);
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Security Verification
        </label>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Required</span>
        </div>
      </div>

      <div className="rounded-xl border bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm dark:from-gray-900 dark:to-gray-950 dark:border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="rounded-md bg-blue-100 p-1 dark:bg-blue-900/30">
                <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Human Verification</span>
            </div>
            
            <div className="rounded-lg bg-gray-100/80 px-3 py-2.5 dark:bg-gray-800/50">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Solve this challenge:</div>
              <div className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">
                {captcha?.question || (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
                    <span className="text-gray-400">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={isRefreshing}
            className="rounded-lg border border-gray-300 bg-white p-2.5 transition-all hover:bg-gray-50 hover:shadow-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Refresh captcha"
          >
            <RefreshCw 
              className={`h-4 w-4 text-gray-600 dark:text-gray-400 ${isRefreshing ? "animate-spin" : ""}`} 
            />
          </button>
        </div>

        <div className="mt-4">
          <div className="relative">
            <input
              className={`w-full rounded-lg border px-4 py-3 pr-10 text-sm transition-all focus:outline-none focus:ring-2 ${
                hasError
                  ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700 dark:bg-red-900/20 dark:focus:border-red-500"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:focus:border-blue-500"
              }`}
              value={answer}
              onChange={(e) => {
                const v = e.target.value;
                setAnswer(v);
                onChange?.({ captchaId: captcha?.captchaId || "", captchaAnswer: v });
              }}
              placeholder="Enter your answer here..."
              aria-label="Captcha answer"
            />
            
            {answer && !hasError && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Check className="h-4 w-4 text-green-500" />
              </div>
            )}
          </div>
          
          {hasError && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Incorrect answer. Please try again.</span>
            </div>
          )}
          
          <div className="mt-2.5 text-xs text-gray-500 dark:text-gray-400">
            This helps us prevent automated spam and abuse.
          </div>
        </div>
      </div>
    </div>
  );
}