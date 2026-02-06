import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/features/navbar";
import { ThemeProvider } from "@/components/theme-provider"



export const metadata: Metadata = {
  title: "Job Portal",
  description: "Job Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <Navbar />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
