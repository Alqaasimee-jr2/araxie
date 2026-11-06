import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Araxie — Peer-to-Peer Student Software & Digital Tool Marketplace",
  description: "Discover peer-built Chrome extensions, study packs, code templates, and micro-tools. Bundled autonomously by AI with instant PayPal checkout and 95% creator payouts.",
  keywords: ["student tools", "software marketplace", "campus developers", "PayPal checkout", "study packs"],
  openGraph: {
    title: "Araxie — Student Digital Economy & Software Marketplace",
    description: "The peer-to-peer software marketplace where campus builders trade study suites, browser tools, and code.",
    siteName: "Araxie",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
