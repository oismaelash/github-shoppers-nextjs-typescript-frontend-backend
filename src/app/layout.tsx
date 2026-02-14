import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub Shoppers",
  description: "AI-Assisted Full Stack Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "bg-background-dark text-slate-100",
        ].join(" ")}
      >
        <NextAuthProvider>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
