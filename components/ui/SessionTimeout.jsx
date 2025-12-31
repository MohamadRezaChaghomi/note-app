"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const EVENTS = ["click", "keydown", "mousemove", "scroll", "touchstart"];

export default function SessionTimeout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let t = null;

    async function ping() {
      try { await fetch("/api/auth/activity", { method: "POST" }); } catch {}
    }

    function onActivity() {
      if (t) clearTimeout(t);
      ping();
      t = setTimeout(async () => {
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
      }, 60 * 1000);
    }

    EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    onActivity();

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      if (t) clearTimeout(t);
    };
  }, [router, pathname]);

  return null;
}
