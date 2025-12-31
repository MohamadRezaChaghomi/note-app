import "./globals.css";
import { Inter, Vazirmatn } from "next/font/google";
import Providers from "./providers";

/* =========================
   Fonts
========================= */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

/* =========================
   Metadata
========================= */
export const metadata = {
  title: {
    default: "Web Notes | Smart Note-Taking App",
    template: "%s | Web Notes",
  },
  description:
    "A modern, secure, and intuitive note-taking application with Persian and English support.",
  keywords: ["notes", "productivity", "note-taking", "persian", "english"],
  authors: [{ name: "Web Notes Team" }],
  creator: "Web Notes",
  publisher: "Web Notes",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "fa_IR",
    title: "Web Notes | Smart Note-Taking App",
    description: "A modern, secure, and intuitive note-taking application.",
    siteName: "Web Notes",
  },

  twitter: {
    card: "summary_large_image",
    title: "Web Notes | Smart Note-Taking App",
    description: "A modern, secure, and intuitive note-taking application.",
  },

  manifest: "/manifest.json",
};

/* =========================
   Viewport (جداگانه – درست)
========================= */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

/* =========================
   Root Layout
========================= */
export default function RootLayout({ children }) {
  return (
    <html
      lang="En"
      dir="ltr"
      className={`${inter.variable} ${vazirmatn.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* PWA / Mobile */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>

      <body className="antialiased bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <Providers>
          {/* Background effects */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
          </div>

          {/* App content */}
          <div className="relative z-10">{children}</div>

          {/* Performance log (اختیاری) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  const start = performance.now();
                  window.addEventListener('load', () => {
                    console.log('Page loaded in', Math.round(performance.now() - start), 'ms');
                  });
                }
              `,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
