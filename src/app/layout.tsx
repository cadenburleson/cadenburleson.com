import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caden Burleson | Personal Website",
  description: "Portfolio and blog of Caden Burleson",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
