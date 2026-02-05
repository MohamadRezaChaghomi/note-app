// app/layout.jsx - نسخه اصلاح شده
import "./globals.css";
import Providers from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const inter = {
  variable: "--font-inter",
};

export const metadata = {
  title: "Web Notes",
  description: "A modern and secure online note-taking experience",
};

export default async function RootLayout({ children }) {
  // دریافت session از سرور
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="font-sans antialiased theme-transition">
        <Providers session={session}> {/* پاس دادن session */}
          {children}
        </Providers>
      </body>
    </html>
  );
}