"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const EVENTS = ["click", "keydown", "mousemove", "scroll", "touchstart"];
const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes
const PING_DEBOUNCE = 30 * 1000; // 30 ثانیہ - activity کو ہر 30 سیکنڈ میں track کریں

export default function SessionTimeout() {
  const router = useRouter();
  const pathname = usePathname();
  const lastPingRef = useRef(0);
  const timeoutIdRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    async function ping() {
      try {
        await fetch("/api/auth/activity", { method: "POST" });
        lastPingRef.current = Date.now();
      } catch {}
    }

    function onActivity() {
      // اگر آخری ping 30 سیکنڈ سے پہلے تھی تو skip کریں
      const now = Date.now();
      if (now - lastPingRef.current < PING_DEBOUNCE) {
        return;
      }

      // موجودہ debounce timer کو cancel کریں
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // نیا debounce timer سیٹ کریں
      debounceTimerRef.current = setTimeout(() => {
        ping();
        
        // Timeout کو reset کریں
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
        
        timeoutIdRef.current = setTimeout(async () => {
          try {
            const res = await fetch("/api/auth/check");
            const data = await res.json();
            
            if (!data.ok) {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/auth/login?timeout=1");
            }
          } catch {
            router.push("/auth/login?timeout=1");
          }
        }, TIMEOUT_DURATION);
      }, 500); // 500ms debounce
    }

    // صرف dashboard routes میں activate کریں
    if (pathname?.startsWith("/dashboard")) {
      EVENTS.forEach((e) =>
        window.addEventListener(e, onActivity, { passive: true })
      );
      // پہلا ping: mount کے وقت
      lastPingRef.current = Date.now();
      ping();
      
      // Timeout کو initialize کریں
      timeoutIdRef.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/auth/check");
          const data = await res.json();
          
          if (!data.ok) {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/auth/login?timeout=1");
          }
        } catch {
          router.push("/auth/login?timeout=1");
        }
      }, TIMEOUT_DURATION);
    }

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [router, pathname]);

  return null;
}
