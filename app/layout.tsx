import "./globals.css";
import Providers from "../components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-black text-black dark:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
