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
  title: "Araxie — Campus Public Space & Student Software Marketplace",
  description: "The open university square where campus builders showcase peer software, run interactive in-browser tools, and trade digital utilities with verified PayPal checkout.",
  keywords: ["campus tools", "public space", "software marketplace", "campus developers", "PayPal checkout", "study packs"],
  openGraph: {
    title: "Araxie — Campus Public Space & Student Software Marketplace",
    description: "The open square where university builders trade software, run browser tools live, and verify cryptographic license keys.",
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
