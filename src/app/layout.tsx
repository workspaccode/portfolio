import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hafez Codex - Mahmoud Hafez Portfolio",
  description: "Software Developer passionate about creating beautiful web applications and mobile apps. Flutter and React developer.",
  keywords: ["Mahmoud Hafez", "Hafez Codex", "Portfolio", "Flutter Developer", "React Developer", "Next.js", "Software Developer"],
  authors: [{ name: "Mahmoud Hafez" }],
  openGraph: {
    title: "Hafez Codex - Mahmoud Hafez Portfolio",
    description: "Software Developer passionate about creating beautiful web applications and mobile apps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hafez Codex - Mahmoud Hafez Portfolio",
    description: "Software Developer passionate about creating beautiful web applications and mobile apps",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
