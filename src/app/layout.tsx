import type { Metadata } from "next";
import Script from "next/script";
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
    url: "https://worldcup2026.vercel.app", // Replace with your actual deployed URL
    siteName: "World Cup 2026 Hub",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 600,
        alt: "World Cup 2026 Hub Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIFA World Cup 2026™ Hub",
    description: "Experience the FIFA World Cup 2026 with real-time match tracking, visual team analytics, player profiles, and live interactive tournament brackets.",
    images: ["/icon.png"],
  },
  verification: {
    google: "Hl1G1R66J_DsaQzUZAbvL7QP29hYVeh4N2TsKoBI6Vk",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DL7NX54GK1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DL7NX54GK1');
          `}
        </Script>
      </head>
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
