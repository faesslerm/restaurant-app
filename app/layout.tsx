import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/hooks/use-cart";
import { ActiveOrderProvider } from "@/hooks/use-active-order";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlowDine",
  description: "Book, eat, and pay - all from your phone",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ActiveOrderProvider>
            <CartProvider>{children}</CartProvider>
          </ActiveOrderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
