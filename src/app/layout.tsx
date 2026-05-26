import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Naphier Awalie | IT Student & Full-Stack Developer",
  description:
    "Personal portfolio of Naphier Awalie, an IT Student and Full-Stack Developer crafting high-performance, accessible, and clean digital solutions.",
  keywords: [
    "Naphier Awalie",
    "IT Student",
    "Full-Stack Developer",
    "Software Engineer",
    "Portfolio",
    "Zamboanga City",
    "WMSU",
    "Next.js",
    "TypeScript",
    "React",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} font-sans`} suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <main className="animate-fade-in">
          {children}
          
          {/* Bottom Copyright Footer */}
          <footer className="max-w-4xl mx-auto px-4 py-8 border-t border-border mt-12">
            <div className="flex justify-center items-center">
              <p className="text-sm text-foreground/70">
                &copy; 2026 Naphier Awalie. All rights reserved.
              </p>
            </div>
          </footer>
        </main>

        {/* Secure & Premium Chatbot Widget */}
        <ChatWidget />
      </body>
    </html>
  );
}
