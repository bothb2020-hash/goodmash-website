import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AgentWidget } from "@/components/AgentWidget";

export const metadata: Metadata = {
  title: {
    default: "GoodMash.io — Your Connection. Your People. Your Network.",
    template: "%s | GoodMash.io",
  },
  description:
    "GoodMash.io is a South African connectivity platform that helps people create private networks and connect authorized members through participating users' existing Internet connectivity.",
  keywords: [
    "GoodMash",
    "GoodMash.io",
    "connectivity platform",
    "private networks",
    "South Africa",
    "authorized connections",
  ],
  metadataBase: new URL("https://goodmash.io"),
  openGraph: {
    title: "GoodMash.io — Your Connection. Your People. Your Network.",
    description:
      "Create private networks and connect authorized members through participating users' existing Internet connectivity.",
    siteName: "GoodMash.io",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AgentWidget />
      </body>
    </html>
  );
}
