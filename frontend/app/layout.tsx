import type { Metadata } from "next";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import CartInitializer from "@/components/AuthInitializer";
import AuthInitializer from "@/components/AuthInitializer";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "E-Commerce Website for buying and selling products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <Toaster position="top-right" />

        {/* GLOBAL INITIALIZERS */}

        <AuthInitializer />

        <CartInitializer />

        {/* LAYOUT */}

        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}