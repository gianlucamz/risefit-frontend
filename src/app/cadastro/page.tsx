import type { Metadata } from "next";
import CadastroForm from "@/components/CadastroForm";

export const metadata: Metadata = {
  title: "Cadastro | RiseFit - Sua jornada começa agora",
  description:
    "Faça seu cadastro na RiseFit e comece a transformar seus resultados hoje mesmo.",
};

export default function CadastroPage() {
  return (
    <main className="min-h-[calc(100vh-100px)] bg-[#ececec] flex justify-center">
      <div className="w-full max-w-260 bg-white px-4 py-8 sm:px-10 sm:py-12 lg:px-16 shadow-xs">
        <CadastroForm mostrarBotaoMock={true} />
      </div>
    </main>
  );
}
