import type { Metadata } from "next";
import CadastroComplementoForm from "@/components/CadastroComplementoForm";

export const metadata: Metadata = {
  title: "Complemento de Cadastro | RiseFit",
  description:
    "Só faltam mais algumas informações para completar o seu cadastro na RiseFit.",
};

export default function CadastroComplementoPage() {
  return (
    <main className="min-h-[calc(100vh-100px)] bg-[#ececec] px-3 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-260 rounded-sm sm:rounded-md bg-white px-4 py-8 sm:px-10 sm:py-12 lg:px-16 shadow-xs">
        <CadastroComplementoForm mostrarBotaoMock={true} />
      </div>
    </main>
  );
}
