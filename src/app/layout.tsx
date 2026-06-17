import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cinepost.com";

export const metadata: Metadata = {
  title: "CinePost — Generate Viral Actor Content",
  description:
    "AI-powered social media posts with real actor photos. Generate compelling Twitter/X content about iconic actors in seconds. Free during early access.",
  keywords: ["actor content", "social media", "film", "twitter", "AI generation"],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "CinePost — Generate Viral Actor Content",
    description:
      "AI-powered social media posts with real actor photos. Generate compelling content in seconds. Free during early access.",
    url: siteUrl,
    siteName: "CinePost",
    images: [
      {
        url: "/og-image.png",
        width: 1940,
        height: 936,
        alt: "CinePost example card featuring Leonardo DiCaprio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CinePost — Generate Viral Actor Content",
    description:
      "AI-powered social media posts with real actor photos. Free during early access.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="59174959-1b9b-46ea-83f8-90237e7ab7b8"
        />
      </head>
      <body className="min-h-screen bg-cinema-black antialiased flex flex-col">
        <Navbar />
        <main className="pt-16 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
