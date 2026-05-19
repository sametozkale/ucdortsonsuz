import type { Metadata } from "next";
import { Inter, Literata } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseMetadata } from "@/lib/seo/metadata";
import { websiteJsonLd } from "@/lib/seo/json-ld";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  ...baseMetadata,
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${literata.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={websiteJsonLd()} />
        <meta name="theme-color" content="#fafaf7" />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
