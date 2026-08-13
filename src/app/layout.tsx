import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RealityOS — Train your mind before the algorithm trains it for you",
  description: "An adaptive AI-powered media literacy platform that turns misinformation exposure into interactive training, teaching you how to investigate claims, evaluate evidence, and make informed decisions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.variable} font-sans min-h-full bg-[#090d16] text-[#f1f5f9] flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}

