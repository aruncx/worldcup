import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026™ Hub - Live Scores, Standings & Analytics",
  description: "Experience the FIFA World Cup 2026 with real-time match tracking, visual team analytics, player profiles, and live interactive tournament brackets.",
  keywords: ["FIFA World Cup 2026", "World Cup Live Scores", "Football Stats", "Soccer Analytics", "World Cup Standings"],
  authors: [{ name: "FIFA World Cup 2026 Hub Team" }],
  openGraph: {
    title: "FIFA World Cup 2026™ Hub - Live Scores, Standings & Analytics",
    description: "Experience the FIFA World Cup 2026 with real-time match tracking, visual team analytics, player profiles, and live interactive tournament brackets.",
    type: "website",
    locale: "en_US",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
