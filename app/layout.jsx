import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Web Notes | Smart Note Taking",
  description: "Modern online note-taking experience with high security and beautiful design",
  keywords: "notes, secure, sync, collaboration, markdown",
  authors: [{ name: "Web Notes Team" }],
  openGraph: {
    title: "Web Notes",
    description: "Your notes, perfected",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        {/* Google reCAPTCHA v3 Script */}
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
          defer
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}