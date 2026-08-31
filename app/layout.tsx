import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Display is a high-contrast serif rather than a condensed poster face: it
 * reads editorial and expensive at large sizes, which is the register the
 * client asked for. Mono carries the small labels and eyebrows.
 */
const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

function siteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw && raw.startsWith("http")) {
    try {
      return new URL(raw);
    } catch {
      // fall through to localhost
    }
  }
  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "Zaba's Shisanyama",
    template: "%s · Zaba's Shisanyama",
  },
  description:
    "Zaba's Shisanyama — flame-grilled meat, township energy, and good times around the fire.",
  icons: { icon: "/images/logo.png" },
  openGraph: {
    siteName: "Zaba's Shisanyama",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
