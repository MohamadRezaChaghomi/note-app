import "./globals.css";
import "@/styles/theme.css";
import { Inter, Vazirmatn } from "next/font/google";
import Providers from "./providers";

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

export const metadata = {
  title: "Web Notes | یادداشت‌های تحت وب",
  description: "تجربه‌ای مدرن از یادداشت‌نویسی آنلاین با امنیت بالا و طراحی زیبا",
  keywords: "یادداشت, امن, همگام‌سازی, همکاری, فارسی",
  authors: [{ name: "تیم Web Notes" }],
  openGraph: {
    title: "Web Notes",
    description: "یادداشت‌های شما، در امن‌ترین مکان ممکن",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${vazirmatn.variable}`}>
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
      <body className="font-persian antialiased">
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}