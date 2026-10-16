import type { Metadata } from "next";
import { Manrope, Anton } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Fonte do texto normal
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

// Fonte dos títulos grandes (ACADEMIA RISEFIT)
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "RiseFit",
  description: "Academia RiseFit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${anton.variable}`}>
      <body className="font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}