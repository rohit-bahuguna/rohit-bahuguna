import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import prisma from "@/lib/prisma";
import { ThemeProvider } from "@/app/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let title = "Rohit Bahuguna | Full Stack Developer";
  let description =
    "Portfolio of Rohit Bahuguna — Full Stack Developer specialising in modern high-performance web applications, React, and Next.js.";
  let keywords = ["Rohit Bahuguna", "Full Stack Developer", "Next.js", "React", "TypeScript", "Portfolio"];

  try {
    const seoConfig = await prisma.siteConfig.findUnique({
      where: { key_state: { key: "seo", state: "live" } },
    });
    if (seoConfig?.data) {
      const parsed = JSON.parse(seoConfig.data);
      if (parsed.metaTitle) title = parsed.metaTitle;
      if (parsed.metaDescription) description = parsed.metaDescription;
      if (parsed.keywords) {
        keywords = Array.isArray(parsed.keywords)
          ? parsed.keywords
          : parsed.keywords.split(",").map((k: string) => k.trim());
      }
    }
  } catch (err) {
    console.error("Error reading SEO config for metadata:", err);
  }

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Rohit Bahuguna" }],
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('portfolio_theme');
                if (saved === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-150">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
