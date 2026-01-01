import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Web Notes",
  description: "Your thoughts, organized beautifully"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}