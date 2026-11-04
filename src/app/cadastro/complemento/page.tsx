import type { Metadata } from "next";
import CadastroComplementoForm from "@/components/CadastroComplementoForm";

export const metadata: Metadata = {
  title: "Complemento de Cadastro | RiseFit",
  description:
    "Só faltam mais algumas informações para completar o seu cadastro na RiseFit.",
};

export default function CadastroComplementoPage() {
  return (
    <main className="bg-[#ececec] px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12 min-h-[calc(100vh-100px)] flex items-center justify-center">
      <div className="w-full max-w-[1040px] rounded-sm sm:rounded-md bg-white px-4 py-8 sm:px-10 sm:py-12 lg:px-16 shadow-xs">
        <CadastroComplementoForm mostrarBotaoMock={true} />
      </div>
    </main>
  );
}

