// app/providers.jsx - نسخه اصلاح شده
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";
import Script from "next/script";
import SessionTimeout from "@/components/ui/SessionTimeout";

export default function Providers({ children, session }) { // دریافت session از props
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider 
        session={session} // پاس دادن session به SessionProvider
        refetchInterval={5 * 60} // هر 5 دقیقه refresh
        refetchOnWindowFocus={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="webnotes-theme"
          disableTransitionOnChange={false}
        >
          <Toaster
            position="bottom-left"
            duration={4000}
            closeButton
            richColors
            toastOptions={{
              classNames: {
                toast:
                  "rounded-xl border bg-background text-foreground shadow-lg",
                description: "text-muted-foreground",
                actionButton:
                  "bg-blue-600 text-white hover:bg-blue-700 rounded-lg",
                cancelButton:
                  "bg-muted text-muted-foreground rounded-lg",
              },
            }}
          />

          <SessionTimeout />
          {children}

          {/* Google reCAPTCHA v3 Script */}
          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
            <Script
              src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
              strategy="afterInteractive"
            />
          )}
        </ThemeProvider>
      </SessionProvider>

      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}