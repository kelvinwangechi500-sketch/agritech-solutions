import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://agritechmarketplace.co.ke"),
  title: {
    default: "AgriTech Marketplace – Livestock, Feeds & Vet Services in Kenya",
    template: "%s | AgriTech Marketplace Kenya",
  },
  description:
    "Kenya's agricultural marketplace. Buy and sell livestock, find vet services, order animal feeds and livestock products. Connecting farmers to everything they need.",
  keywords: [
    "livestock for sale Kenya",
    "animal feeds Kenya",
    "vet services near me",
    "cows for sale Meru",
    "sheep for sale Kenya",
    "dairy cattle Kenya",
    "poultry feed Kenya",
    "veterinary services Kenya",
    "agribusiness Kenya",
    "farm products Kenya",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "AgriTech Marketplace",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Kenya" />
      </head>
      <body>{children}</body>
    </html>
  );
}
