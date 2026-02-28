import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { NextAuthSessionProvider } from "@/components/providers/session-provider";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ResumeOps — ATS Resume Optimizer",
  description:
    "See exactly why your resume gets filtered out and how to fix it in minutes. AI-powered ATS score analysis.",
  keywords: ["resume", "ATS", "job application", "resume optimization", "ATS score"],
  openGraph: {
    title: "ResumeOps — ATS Resume Optimizer",
    description: "See exactly why your resume gets filtered out and how to fix it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={instrumentSans.className} suppressHydrationWarning>
        <NextAuthSessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
