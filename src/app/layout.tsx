import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CinePost — Generate Viral Actor Content",
  description:
    "AI-powered social media posts with real actor headshots. Generate compelling Twitter/X content about iconic actors in seconds.",
  keywords: ["actor content", "social media", "film", "twitter", "AI generation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cinema-black antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
