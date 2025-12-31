import "./globals.css";
import { Inter, Vazirmatn } from "next/font/google";
import Providers from "./providers";
import "@/styles/globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
});

export const metadata = {
  title: {
    default: "Web Notes | Smart Note-Taking App",
    template: "%s | Web Notes"
  },
  description: "A modern, secure, and intuitive note-taking application with Persian/English support, real-time collaboration, and advanced search capabilities.",
  keywords: ["notes", "productivity", "note-taking", "web app", "persian", "english"],
  authors: [{ name: "Web Notes Team" }],
  creator: "Web Notes",
  publisher: "Web Notes",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://webnotes.app",
    title: "Web Notes | Smart Note-Taking App",
    description: "A modern, secure, and intuitive note-taking application.",
    siteName: "Web Notes",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Web Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Notes | Smart Note-Taking App",
    description: "A modern, secure, and intuitive note-taking application.",
    images: ["/twitter-image.png"],
    creator: "@webnotes",
  },
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="fa" 
      dir="rtl" 
      className={`${inter.variable} ${vazirmatn.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* PWA Theme Color */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Font Preload */}
        <link
          rel="preload"
          href="/_next/static/media/GeistVF.7d5e19e1.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <Providers>
          {/* Background Effects */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
          </div>
          
          {/* Main Content */}
          <div className="relative z-10">
            {children}
          </div>
          
          {/* Footer Scripts */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (typeof window !== 'undefined') {
                  // Performance monitoring
                  const startTime = performance.now();
                  window.addEventListener('load', () => {
                    const loadTime = performance.now() - startTime;
                    console.log(\`Page loaded in \${Math.round(loadTime)}ms\`);
                  });
                  
                  // Service Worker Registration
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', () => {
                      navigator.serviceWorker.register('/sw.js');
                    });
                  }
                  
                  // Offline detection
                  window.addEventListener('offline', () => {
                    document.dispatchEvent(new CustomEvent('app:offline'));
                  });
                  
                  window.addEventListener('online', () => {
                    document.dispatchEvent(new CustomEvent('app:online'));
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