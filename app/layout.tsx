import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Fun "Word Art" Font
const calistoga = Calistoga({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-calistoga',
});

export const metadata: Metadata = {
  title: "Whozin - Simple Event Sign-up",
  description: "The simplest sign-up tool for community events. Create WhatsApp-friendly invite links in 30 seconds.",
  keywords: [
    "Whozin",
    "WhatsApp RSVP",
    "Event Planner UK",
    "Sunday Roast",
    "5-a-side Football",
    "Pub Quiz",
    "School Fete",
    "Diwali",
    "Christmas",
    "Community Events"
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
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
      <body className={`${inter.variable} ${calistoga.variable} font-sans antialiased`} suppressHydrationWarning>
        <Suspense fallback={children}>
          <PostHogProvider>{children}</PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}