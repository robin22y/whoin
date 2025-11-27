import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Whozin - Effortless Event Sign-ups",
  description: "The simplest sign-up tool for community events. Create WhatsApp-friendly invite links in 30 seconds.",
  keywords: [
    "Whozin",
    "Dinner Party Planner",
    "Committee Meeting",
    "Club Event",
    "Family Gathering",
    "Event RSVP",
    "Event Sign-up"
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Whozin",
  },
  openGraph: {
    siteName: "Whozin",
    title: "Whozin - Simple Event Sign-up",
    description: "The simplest sign-up tool for community events. Create WhatsApp-friendly invite links in 30 seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whozin - Simple Event Sign-up",
    description: "The simplest sign-up tool for community events. Create WhatsApp-friendly invite links in 30 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Suspense fallback={children}>
          <PostHogProvider>{children}</PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}