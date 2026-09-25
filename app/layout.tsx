import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getThemePreference } from "@/lib/session";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Expense Tracker - Financial Management for University Students",
  description:
    "A production-ready SaaS student expense tracker with real-time analytics, strict privacy authorization, and modern UI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read theme directly from cookie on the server for zero-flicker SSR
  const theme = await getThemePreference();

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body className={`${inter.className} min-h-screen bg-[#F3E8DF] dark:bg-[#2b191a] text-[#452829] dark:text-[#F3E8DF] antialiased`}>
        {children}
      </body>
    </html>
  );
}
