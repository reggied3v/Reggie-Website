import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ReggieD3V - Developer & Creator",
  description: "Personal website and portfolio of ReggieD3V - showcasing projects, thoughts, and professional journey in software development.",
  keywords: ["ReggieD3V", "developer", "portfolio", "software engineer", "web development", "programming"],
  authors: [{ name: "ReggieD3V" }],
  creator: "ReggieD3V",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://reggied3v.com",
    title: "ReggieD3V - Developer & Creator",
    description: "Personal website and portfolio of ReggieD3V - showcasing projects, thoughts, and professional journey in software development.",
    siteName: "ReggieD3V",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReggieD3V - Developer & Creator",
    description: "Personal website and portfolio of ReggieD3V - showcasing projects, thoughts, and professional journey in software development.",
    creator: "@reggied3v",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
