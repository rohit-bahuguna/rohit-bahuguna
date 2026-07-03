import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"], 
});

export const metadata: Metadata = {
  title: "Rohit Bahuguna | Full Stack Developer",
  description:
    "Portfolio of Rohit Bahuguna — Full Stack Developer specialising in the MERN stack, React, and Next.js.",
  keywords: ["Rohit Bahuguna", "Full Stack Developer", "MERN", "React", "Next.js", "Portfolio"],
  authors: [{ name: "Rohit Bahuguna" }],
};

export default function RootLayout({ 
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
