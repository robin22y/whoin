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
  title: "The Invite Link - Simple Event Sign-ups",
  description: "The simplest way to create an event. Just share the link and get a list.",
  keywords: [
    "Invite Link Generator",
    "RSVP Link",
    "Event Planner",
    "WhatsApp Invite",
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
    title: "The Invite Link",
  },
  openGraph: {
    siteName: "The Invite Link",
    title: "The Invite Link - Simple Event Sign-ups",
    description: "The simplest way to create an event. Just share the link and get a list.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Invite Link - Simple Event Sign-ups",
    description: "The simplest way to create an event. Just share the link and get a list.",
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