/**
 * layout.tsx — root HTML shell
 *
 * This wraps every page on the site. Anything you put here (nav, footer, fonts,
 * metadata) applies globally. Next.js renders this once and slots each page's
 * content into the {children} placeholder.
 */

import type { Metadata } from "next";
import { Libre_Franklin, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Each font is loaded from Google Fonts and exposed as a CSS variable.
// globals.css maps those variables to --font-sans, --font-serif, --font-mono.
const libreFranklin = Libre_Franklin({
  variable: "--font-body", // body text
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display", // headings and titles (the serif)
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains", // code blocks
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Digital Garden",
    template: "%s | Digital Garden",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪴</text></svg>",
  },
  description:
    "A personal digital garden exploring ideas in crypto, psychology, philosophy, and technology. Learning in public.",
  openGraph: {
    title: "Digital Garden",
    description:
      "A personal digital garden exploring ideas in crypto, psychology, philosophy, and technology. Learning in public.",
    type: "website",
    locale: "en_US",
    siteName: "Digital Garden",
  },
  twitter: {
    card: "summary",
    title: "Digital Garden",
    description:
      "A personal digital garden exploring ideas in crypto, psychology, philosophy, and technology. Learning in public.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreFranklin.variable} ${fraunces.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
