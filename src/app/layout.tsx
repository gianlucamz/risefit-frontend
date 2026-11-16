import type { Metadata } from "next";
import { Manrope, Anton } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BarraInferior from "@/components/BarraInferior";

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
      {/* pb no celular = altura da barra inferior fixa (41px) */}
      <body className="font-sans pb-[calc(41px+env(safe-area-inset-bottom))] lg:pb-0">
        <Header />
        {children}
        <Footer />
        <BarraInferior />
      </body>
    </html>
  );
}