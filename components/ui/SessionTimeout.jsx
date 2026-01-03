"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const EVENTS = ["click", "keydown", "mousemove", "scroll", "touchstart"];
const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes

export default function SessionTimeout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let timeoutId = null;

    async function ping() {
      try {
        await fetch("/api/auth/activity", { method: "POST" });
      } catch {}
    }

    function onActivity() {
      // Clear existing timeout
      if (timeoutId) clearTimeout(timeoutId);

      // Ping the server to update activity
      ping();

      // Set new timeout for 10 minutes
      timeoutId = setTimeout(async () => {
        try {
          const res = await fetch("/api/auth/check");
          const data = await res.json();
          
          if (!data.ok) {
            // Session is invalid, logout and redirect
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/auth/login?timeout=1");
          }
        } catch {
          // Network error, assume session expired
          router.push("/auth/login?timeout=1");
        }
      }, TIMEOUT_DURATION);
    }

    // Only activate on dashboard routes
    if (pathname?.startsWith("/dashboard")) {
      EVENTS.forEach((e) =>
        window.addEventListener(e, onActivity, { passive: true })
      );
      onActivity(); // Initialize timeout on mount
    }

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, pathname]);

  return null;
}
