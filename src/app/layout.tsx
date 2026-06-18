import type { Metadata } from "next";
import { Fraunces, Mulish } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
});

const SITE_URL = "https://victoriababycare.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Apex is canonical — keeps www + apex from splitting SEO (both serve the site).
  alternates: { canonical: "/" },
  title: "Victoria Baby Care — a calm companion for feeds, sleep & milestones",
  description:
    "The gentle baby tracker that does less for tired parents. Log feeds, sleep, diapers, growth and milestones, with a warm Night-Feed mode for 3am. In 20 languages.",
  applicationName: "Victoria Baby Care",
  openGraph: {
    title: "Victoria Baby Care — a calm companion for new parents",
    description:
      "Less input, more reassurance. Feeds, sleep, diapers, growth and milestones — with a warm Night-Feed mode for 3am.",
    url: SITE_URL,
    siteName: "Victoria Baby Care",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Victoria Baby Care",
    description: "A calm companion for feeds, sleep & milestones.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${mulish.variable}`}>
      <body>{children}</body>
    </html>
  );
}
