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
  title: "WhoIn.uk - Simple Sign-up",
  description: "The simplest sign-up tool for community events. Create WhatsApp-friendly invite links in 30 seconds.",
  keywords: [
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
    title: "WhoIn",
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